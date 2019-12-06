using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Logging;
using SessionFeed.Models;

namespace SessionFeed
{
    public static class BroadcastVotes
    {
        private const string HubName = "sessionfeedbroadcaster";

        [FunctionName("BroadcastVotes")]
        public static async Task Run([CosmosDBTrigger(
                Constants.DatabaseName,
                Constants.VotesCollectionName,
                ConnectionStringSetting = Constants.ConnectionStringName,
                LeaseCollectionName = "leases")]
            IReadOnlyList<Document> documents,
            [CosmosDB(
                Constants.DatabaseName,
                Constants.ThreadsCollectionName,
                ConnectionStringSetting = Constants.ConnectionStringName)]
            DocumentClient threadClient,
            [SignalR(HubName = HubName)] IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger log)
        {
            try
            {
                var votesUri =
                    UriFactory.CreateDocumentCollectionUri(Constants.DatabaseName, Constants.VotesCollectionName);

                var voteList = new List<VoteCategory>();
                var voteAverages = new List<VoteCategory>();

                log.LogInformation("Getting threads");
                var voteQuery = threadClient
                    .CreateDocumentQuery<VoteDTO>(votesUri, new FeedOptions {EnableCrossPartitionQuery = true})
                    .AsDocumentQuery();

                while (voteQuery.HasMoreResults)
                    foreach (VoteDTO result in await voteQuery.ExecuteNextAsync().ConfigureAwait(false))
                        if (result != null && result.categories != null)
                            voteList.AddRange(result.categories);

                foreach (var voteCategory in voteList.GroupBy(x => x.name).Select(x => x.FirstOrDefault()))
                {
                    voteAverages.Add(new VoteCategory
                    {
                        name = voteCategory.name, count = voteList.Where(p => p.name.Equals(voteCategory.name)).Count(),
                        average = Convert.ToSingle(voteList.Where(p => p.name.Equals(voteCategory.name))
                            .Average(p => p.rating))
                    });
                    log.LogInformation("Category Name: {0}; Vote count:{1}; Vote average:{2}\t",
                        voteAverages.Last().name, voteAverages.Last().count, voteAverages.Last().average);
                }

                await signalRMessages.AddAsync(
                    new SignalRMessage
                    {
                        Target = "message",
                        Arguments = new[] {new {channel = "@@socket/UPDATE_VOTE", payload = voteAverages}}
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