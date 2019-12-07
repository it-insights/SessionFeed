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

        private static async Task<List<T>> GetItems<T>(DocumentClient client, string collectionId)
        {
            var list = 
                new List<T>();
            var uri =
                UriFactory.CreateDocumentCollectionUri(Constants.DatabaseName, collectionId);
            var query = client
                    .CreateDocumentQuery<T>(uri, new FeedOptions { EnableCrossPartitionQuery = true })
                    .AsDocumentQuery();
            while (query.HasMoreResults)
                foreach (T result in await query.ExecuteNextAsync())
                    list.Add(result);
            return list;
        }

        [FunctionName("OnConnect")]
        public static async Task Run(
            [EventGridTrigger] EventGridEvent eventGridEvent,
            [SignalR(HubName = HubName)] IAsyncCollector<SignalRMessage> signalRMessages,
            [CosmosDB(
                Constants.DatabaseName,
                Constants.ThreadsCollectionName,
                ConnectionStringSetting = Constants.ConnectionStringName,
                CreateIfNotExists = true)]
            DocumentClient threadClient,
            [CosmosDB(
                Constants.DatabaseName,
                Constants.VotesCollectionName,
                ConnectionStringSetting = Constants.ConnectionStringName,
                CreateIfNotExists = true)]
            DocumentClient voteClient,
            ILogger log)
        {
            try
            {
                var threadList = await GetItems<Thread>(threadClient, Constants.ThreadsCollectionName);
                var voteList = await GetItems<Vote>(threadClient, Constants.VotesCollectionName);

                List<VoteCategory> voteCategories = voteList.SelectMany(p => p.categories).GroupBy(x => x.name).Select(x => x.FirstOrDefault()).ToList<VoteCategory>();
                var voteAverages = new List<VoteCategory>();

                if (!voteList.Any<Vote>())
                {
                    var initCategories = new List<string> {"Category 1", "Category 2", "Category 3", "Category 4"};
                    foreach (var category in initCategories)
                        voteAverages.Add(new VoteCategory {name = category, count = 0, average = 0});
                    log.LogInformation("Using init categories");
                }
                else
                {
                    foreach (var voteCategory in voteCategories)
                    {
                        voteAverages.Add(new VoteCategory
                        {
                            name = voteCategory.name,
                            count = voteList.SelectMany(p => p.categories).Where(p => p != null).Where(p => p.name.Equals(voteCategory.name)).Count(),
                            average = Convert.ToSingle(voteList.SelectMany(p => p.categories).Where(p => p != null)
                                .Where(p => p.name.Equals(voteCategory.name))
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