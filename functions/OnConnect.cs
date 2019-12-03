// Default URL for triggering event grid function in the local environment.
// http://localhost:7071/runtime/webhooks/EventGrid?functionName={functionname}
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;

namespace SessionFeed
{
    public static class OnConnect
    {
        private const string HubName = "sessionfeedbroadcaster";

        public class SignalREvent
        {
            public DateTime Timestamp { get; set; }
            public string HubName { get; set; }
            public string ConnectionId { get; set; }
            public string UserId { get; set; }
        }

        public class ThreadComment
        {
            public DateTime timestamp { get; set; }
            public string author { get; set; }
            public string text { get; set; }
        }

        public class Thread
        {
            public string clientId { get; set; }
            public string id { get; set; }
            public DateTime timestamp { get; set; }
            public string author { get; set; }
            public string text { get; set; }
            public List<ThreadComment> comments { get; set; }
            public List<string> likedBy { get; set; }
    }

        [FunctionName("OnConnect")]
        public static async Task Run(
            [EventGridTrigger]EventGridEvent eventGridEvent,
            [SignalR(HubName = HubName)]IAsyncCollector<SignalRMessage> signalRMessages,
            [CosmosDB(
                databaseName: "sessionfeed",
                collectionName: "signalrtch",
                ConnectionStringSetting = "CosmosDBConnection")] DocumentClient client,
            ILogger log)
        {
            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("sessionfeed", "signalrtch");
            log.LogInformation("Getting db entries");

            List<Thread> threadList = new List<Thread>();

            IDocumentQuery<Thread> query = client.CreateDocumentQuery<Thread>(collectionUri, new FeedOptions { EnableCrossPartitionQuery = true }).AsDocumentQuery();

            while (query.HasMoreResults)
            {
                foreach (Thread result in await query.ExecuteNextAsync())
                {
                    threadList.Add(result);
                }
            }

            var eventMessage = ((JObject)eventGridEvent.Data).ToObject<SignalREvent>();

            await signalRMessages.AddAsync(
                new SignalRMessage
                {
                    UserId = eventMessage.UserId,
                    Target = "message",
                    Arguments = new[] { new { channel = "@@socket/INIT", payload = threadList } }
                });
        }
    }
}
