using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;

namespace SessionFeed
{
    public static class BroadcastVotes
    {
        public class VoteCategory
        {
            public string name { get; set; }
            public int rating { get; set; }
            public int count { get; set; }
            public float average{ get; set; }
        }

        public class VoteDTO
        {
            public List<VoteCategory> categories { get; set; }
        }

        private const string HubName = "sessionfeedbroadcaster";

        [FunctionName("BroadcastVotes")]
        public static async Task Run([CosmosDBTrigger(
            databaseName: "sessionfeed",
            collectionName: "signalrtchvotes",
            ConnectionStringSetting = "CosmosDBConnection",
            LeaseCollectionName = "leases")]IReadOnlyList<Document> documents,
            [CosmosDB(
                databaseName: "sessionfeed",
                collectionName: "signalrtchthreads",
                ConnectionStringSetting = "CosmosDBConnection")] DocumentClient threadClient,
            [SignalR(HubName = HubName)]IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger log)
        {
            try
            {
                Uri votesUri = UriFactory.CreateDocumentCollectionUri("sessionfeed", "signalrtchvotes");

                List<VoteCategory> voteList = new List<VoteCategory>();
                List<VoteCategory> voteAverages = new List<VoteCategory>();

                log.LogInformation("Getting threads");
                IDocumentQuery<VoteDTO> voteQuery = threadClient.CreateDocumentQuery<VoteDTO>(votesUri, new FeedOptions { EnableCrossPartitionQuery = true }).AsDocumentQuery();

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
                    voteAverages.Add(new VoteCategory { name = voteCategory.name, count = voteList.Where(p => p.name.Equals(voteCategory.name)).Count(), average = Convert.ToSingle(voteList.Where(p => p.name.Equals(voteCategory.name)).Average(p => p.rating))});
                    log.LogInformation("Category Name: {0}; Vote count:{1}; Vote average:{2}\t", voteAverages.Last().name, voteAverages.Last().count, voteAverages.Last().average);
                }

                await signalRMessages.AddAsync(
                    new SignalRMessage
                    {
                        Target = "message",
                        Arguments = new[] { new { channel = "@@socket/UPDATE_VOTE", payload = voteAverages } }
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
