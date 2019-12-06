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
    public static class BroadcastThreads
    {
        private const string HubName = "sessionfeedbroadcaster";

        [FunctionName("BroadcastThreads")]
        public static async Task Run([CosmosDBTrigger(
            databaseName: Constants.DatabaseName,
            collectionName: Constants.ThreadsCollectionName,
            CreateLeaseCollectionIfNotExists = true,
            ConnectionStringSetting = Constants.ConnectionStringName,
            LeaseCollectionName = "leases")]IReadOnlyList<Document> documents,
            [CosmosDB(
                databaseName: Constants.DatabaseName,
                collectionName: Constants.ThreadsCollectionName,
                ConnectionStringSetting = Constants.ConnectionStringName)] DocumentClient threadClient,
            [SignalR(HubName = HubName)]IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger log)
        {
            try
            {
                Uri collectionUri = UriFactory.CreateDocumentCollectionUri(Constants.DatabaseName, Constants.ThreadsCollectionName);
                log.LogInformation("Getting votes");

                List<Thread> threadList = new List<Thread>();

                foreach (var document in documents)
                {
                    IDocumentQuery<Thread> query = threadClient.CreateDocumentQuery<Thread>(collectionUri, new FeedOptions { EnableCrossPartitionQuery = true }).Where(p => p.id.Equals(document.Id)).AsDocumentQuery();

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
                        Arguments = new[] { new { channel = "@@socket/UPDATE_THREAD", payload = threadList } }
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
