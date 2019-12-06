// Default URL for triggering event grid function in the local environment.
// http://localhost:7071/runtime/webhooks/EventGrid?functionName={functionname}
using System;
using System.Threading.Tasks;
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using System.Linq;

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

        public class User
        {
            public string name { get; set; }
            public string avatarUrl { get; set; }
        }

        public class ThreadComment
        {
            public DateTime timestamp { get; set; }
            public User author { get; set; }
            public string text { get; set; }
        }

        public class Thread
        {
            public string clientId { get; set; }
            public string id { get; set; }
            public DateTime timestamp { get; set; }
            public User author { get; set; }
            public string text { get; set; }
            public List<ThreadComment> comments { get; set; }
            public List<string> likedBy { get; set; }
        }

        public class VoteCategory
        {
            public string name { get; set; }
            public int rating { get; set; }
            public int count { get; set; }
            public float average { get; set; }
        }

        public class VoteDTO
        {
            public List<VoteCategory> categories { get; set; }
        }

        [FunctionName("OnConnect")]
        public static async Task Run(
            [EventGridTrigger]EventGridEvent eventGridEvent,
            [SignalR(HubName = HubName)]IAsyncCollector<SignalRMessage> signalRMessages,
            [CosmosDB(
                databaseName: "sessionfeed",
                collectionName: "signalrtchthreads",
                ConnectionStringSetting = "CosmosDBConnection")] DocumentClient threadClient,
            [CosmosDB(
                databaseName: "sessionfeed",
                collectionName: "signalrtchvotes",
                ConnectionStringSetting = "CosmosDBConnection")] DocumentClient voteClient,
            ILogger log)
        {
            try
            {
                // Get threads

                Uri collectionUri = UriFactory.CreateDocumentCollectionUri("sessionfeed", "signalrtchthreads");
                List<Thread> threadList = new List<Thread>();

                log.LogInformation("Getting threads");
                IDocumentQuery<Thread> query = threadClient.CreateDocumentQuery<Thread>(collectionUri, new FeedOptions { EnableCrossPartitionQuery = true }).AsDocumentQuery();

                while (query.HasMoreResults)
                {
                    foreach (Thread result in await query.ExecuteNextAsync().ConfigureAwait(false))
                    {
                        threadList.Add(result);
                    }
                }

                // Get votes

                Uri votesUri = UriFactory.CreateDocumentCollectionUri("sessionfeed", "signalrtchvotes");
                List<VoteCategory> voteList = new List<VoteCategory>();
                List<VoteCategory> voteAverages = new List<VoteCategory>();

                log.LogInformation("Getting votes");
                IDocumentQuery<VoteDTO> voteQuery = voteClient.CreateDocumentQuery<VoteDTO>(votesUri, new FeedOptions { EnableCrossPartitionQuery = true }).AsDocumentQuery();

                while (voteQuery.HasMoreResults)
                {
                    foreach (VoteDTO result in await voteQuery.ExecuteNextAsync().ConfigureAwait(false))
                    {
                        if (result != null && result.categories != null)
                        {
                            voteList.AddRange(result.categories);
                        }
                    }
                }

                foreach (VoteCategory voteCategory in voteList.GroupBy(x => x.name).Select(x => x.FirstOrDefault()))
                {
                    voteAverages.Add(new VoteCategory { name = voteCategory.name, count = voteList.Where(p => p.name.Equals(voteCategory.name)).Count(), average = Convert.ToSingle(voteList.Where(p => p.name.Equals(voteCategory.name)).Average(p => p.rating)) });
                    log.LogInformation("Category Name: {0}; Vote count:{1}; Vote average:{2}\t", voteAverages.Last().name, voteAverages.Last().count, voteAverages.Last().average);
                }

                var eventMessage = ((JObject)eventGridEvent.Data).ToObject<SignalREvent>();

                await signalRMessages.AddAsync(
                    new SignalRMessage
                    {
                        UserId = eventMessage.UserId,
                        Target = "message",
                        Arguments = new[] { new { channel = "@@socket/INIT", payload = new List<dynamic> { threadList.OrderByDescending(o => o.likedBy != null ? o.likedBy.Count : float.MinValue).ToList(), voteAverages } } }
                    }).ConfigureAwait(false);
            }
            catch (Exception e)
            {
                log.LogError(e.ToString());
                throw;
            }
        }
    }
}