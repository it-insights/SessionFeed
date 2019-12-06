// Default URL for triggering event grid function in the local environment.
// http://localhost:7071/runtime/webhooks/EventGrid?functionName={functionname}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using SessionFeed.Models;

namespace SessionFeed
{
    public static class OnConnect
    {
        private const string HubName = "sessionfeedbroadcaster";

        [FunctionName("OnConnect")]
        public static async Task Run(
            [EventGridTrigger] EventGridEvent eventGridEvent,
            [SignalR(HubName = HubName)] IAsyncCollector<SignalRMessage> signalRMessages,
            [CosmosDB(
                Constants.DatabaseName,
                Constants.ThreadsCollectionName,
                ConnectionStringSetting = Constants.ConnectionStringName)]
            DocumentClient threadClient,
            [CosmosDB(
                Constants.DatabaseName,
                Constants.VotesCollectionName,
                ConnectionStringSetting = Constants.ConnectionStringName)]
            DocumentClient voteClient,
            ILogger log)
        {
            try
            {
                // Get threads

                var collectionUri =
                    UriFactory.CreateDocumentCollectionUri(Constants.DatabaseName, Constants.ThreadsCollectionName);
                var threadList = new List<Thread>();

                log.LogInformation("Getting threads");
                var query = threadClient
                    .CreateDocumentQuery<Thread>(collectionUri, new FeedOptions {EnableCrossPartitionQuery = true})
                    .AsDocumentQuery();

                while (query.HasMoreResults)
                    foreach (Thread result in await query.ExecuteNextAsync().ConfigureAwait(false))
                        threadList.Add(result);

                // Get votes

                var votesUri =
                    UriFactory.CreateDocumentCollectionUri(Constants.DatabaseName, Constants.VotesCollectionName);
                var voteList = new List<VoteCategory>();
                var voteAverages = new List<VoteCategory>();

                log.LogInformation("Getting votes");
                var voteQuery = voteClient
                    .CreateDocumentQuery<VoteDTO>(votesUri, new FeedOptions {EnableCrossPartitionQuery = true})
                    .AsDocumentQuery();

                while (voteQuery.HasMoreResults)
                    foreach (VoteDTO result in await voteQuery.ExecuteNextAsync().ConfigureAwait(false))
                        if (result != null && result.categories != null)
                            voteList.AddRange(result.categories);
                if (voteList.Count == 0)
                {
                    var initCategories = new List<string> {"Category 1", "Category 2", "Category 3", "Category 4"};
                    foreach (var category in initCategories)
                        voteAverages.Add(new VoteCategory {name = category, count = 0, average = 0});
                }
                else
                {
                    foreach (var voteCategory in voteList.GroupBy(x => x.name).Select(x => x.FirstOrDefault()))
                    {
                        voteAverages.Add(new VoteCategory
                        {
                            name = voteCategory.name,
                            count = voteList.Where(p => p.name.Equals(voteCategory.name)).Count(),
                            average = Convert.ToSingle(voteList.Where(p => p.name.Equals(voteCategory.name))
                                .Average(p => p.rating))
                        });
                        log.LogInformation("Category Name: {0}; Vote count:{1}; Vote average:{2}",
                            voteAverages.Last().name, voteAverages.Last().count, voteAverages.Last().average);
                    }
                }


                var eventMessage = ((JObject) eventGridEvent.Data).ToObject<SignalREvent>();

                await signalRMessages.AddAsync(
                    new SignalRMessage
                    {
                        UserId = eventMessage.UserId,
                        Target = "message",
                        Arguments = new[]
                        {
                            new
                            {
                                channel = "@@socket/INIT",
                                payload = new List<dynamic>
                                {
                                    threadList.OrderByDescending(o =>
                                        o.likedBy != null ? o.likedBy.Count : float.MinValue).ToList(),
                                    voteAverages
                                }
                            }
                        }
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