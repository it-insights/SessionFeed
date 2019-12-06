using System;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

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

        public class Result<T>
        {
            public string Error { get; set; }
            public T Payload { get; set; }
        }

        [FunctionName("AddThread")]
        public static async Task<ActionResult> Run(
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

            try
            {
                await threadsOut.AddAsync(threadItem);
                return new JsonResult(new Result<Thread>() { Payload = threadItem });
            }
            catch (Exception e)
            {
                return new JsonResult(new Result<Thread>() { Error = e.Message });
            }
        }
    }
}
