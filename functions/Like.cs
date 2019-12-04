using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;

namespace SessionFeed
{
    public static class Like
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
            public string id { get; set; }
            public string clientId { get; set; }
            public DateTime timestamp { get; set; }
            public User author { get; set; }
            public string text { get; set; }
            public List<ThreadComment> comments { get; set; }
            public List<string> likedBy { get; set; }
        }

        public class LikeDTO
        {
            public string clientId { get; set; }
            public string id { get; set; }
            public string author { get; set; }
        }

        [FunctionName("Like")]
        public static async Task Run(
                [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] LikeDTO likeDTO,
                [CosmosDB(
                databaseName: "sessionfeed",
                collectionName: "signalrtch",
                CreateIfNotExists = true,
                ConnectionStringSetting = "CosmosDBConnection")]
                IAsyncCollector<Thread> threadsOut,
                [CosmosDB(
                databaseName: "sessionfeed",
                collectionName: "signalrtch",
                ConnectionStringSetting = "CosmosDBConnection",
                Id = "{id}",
                PartitionKey = "{clientId}")] Thread thread,
                ILogger log)
        {
            log.LogInformation($"Triggered Like");

            if (thread == null)
            {
                throw new System.Exception("Invalid clientId, id combination");
            }

            if (thread.likedBy == null)
            {
                thread.likedBy = new List<string>();
            }

            thread.likedBy.Add(likeDTO.author);

            log.LogInformation($"Inserting Thread:{thread.id}");
            await threadsOut.AddAsync(thread);
        }
    }
}
