using System;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace SessionFeed
{
    public static class AddThread
    {
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

        [FunctionName("AddThread")]
        public static async Task Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] Thread threadItem,
            [CosmosDB(
            databaseName: "sessionfeed",
            collectionName: "signalrtchthreads",
            CreateIfNotExists = true,
            ConnectionStringSetting = "CosmosDBConnection")]
            IAsyncCollector<Thread> threadsOut,
            ILogger log)
        {
            log.LogInformation("AddThread triggered");

            await threadsOut.AddAsync(threadItem);
        }
    }
}
