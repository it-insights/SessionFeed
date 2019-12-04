using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Logging;

namespace SessionFeed
{
    public static class BroadcastThreads
    {
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

        private const string HubName = "sessionfeedbroadcaster";

        [FunctionName("BroadcastThreads")]
        public static async Task Run([CosmosDBTrigger(
            databaseName: "sessionfeed",
            collectionName: "signalrtch",
            CreateLeaseCollectionIfNotExists = true,
            ConnectionStringSetting = "CosmosDBConnection",
            LeaseCollectionName = "leases")]IReadOnlyList<Document> documents,
            [CosmosDB(
                databaseName: "sessionfeed",
                collectionName: "signalrtch",
                ConnectionStringSetting = "CosmosDBConnection")] DocumentClient client,
            [SignalR(HubName = HubName)]IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger log)
        {
            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("sessionfeed", "signalrtch");
            log.LogInformation("Getting db entries");

            List<Thread> threadList = new List<Thread>();

            foreach (var document in documents)
            {
                IDocumentQuery<Thread> query = client.CreateDocumentQuery<Thread>(collectionUri, new FeedOptions { EnableCrossPartitionQuery = true }).Where(p => p.id.Equals(document.Id)).AsDocumentQuery();

                while (query.HasMoreResults)
                {
                    foreach (Thread result in await query.ExecuteNextAsync())
                    {
                        threadList.Add(result);
                    }
                }
            }

            await signalRMessages.AddAsync(
                new SignalRMessage
                {
                    Target = "message",
                    Arguments = new[] { new { channel = "@@socket/INIT", payload = threadList } }
                });
        }
    }
}
