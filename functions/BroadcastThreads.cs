using System;
using System.Collections.Generic;
using Microsoft.Azure.Documents;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;

namespace SessionFeed
{
    public static class BroadcastThreads
    {
        private const string HubName = "sessionfeedbroadcaster";

        [FunctionName("BroadcastThreads")]
        public static void Run([CosmosDBTrigger(
            databaseName: "sessionfeed",
            collectionName: "signalrtch",
            CreateLeaseCollectionIfNotExists = true,
            ConnectionStringSetting = "CosmosDBConnection",
            LeaseCollectionName = "leases")]IReadOnlyList<Document> input,
            [SignalR(HubName = HubName)]IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger log)
        {
            if (input != null && input.Count > 0)
            {
                log.LogInformation("Documents modified " + input.Count);
                log.LogInformation("First document Id " + input[0].Id);
                log.LogInformation("Inputs " + input);
                //return signalRMessages.AddAsync(
                //    new SignalRMessage
                //    {
                //        // the message will only be sent to this user ID
                //        UserId = eventMessage.UserId,
                //        Target = "message",
                //        Arguments = new[] { message }
                //    });
            }
        }
    }
}
