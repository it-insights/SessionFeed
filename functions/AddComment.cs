using System;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace SessionFeed
{
    public static class AddComment
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

        public class CommentDTO
        {
            public string clientId { get; set; }
            public string id { get; set; }
            public ThreadComment comment { get; set; }
        }

        public class Result<T>
        {
            public string Error { get; set; }
            public T Payload { get; set; }
        }

        [FunctionName("AddComment")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] CommentDTO commentDTO,
            [CosmosDB(
            databaseName: "sessionfeed",
            collectionName: "signalrtchthreads",
            CreateIfNotExists = true,
            ConnectionStringSetting = "CosmosDBConnection")]
            IAsyncCollector<Thread> threadsOut,
            [CosmosDB(
                databaseName: "sessionfeed",
                collectionName: "signalrtchthreads",
                ConnectionStringSetting = "CosmosDBConnection",
                Id = "{id}",
                PartitionKey = "{clientId}")] Thread thread,
            ILogger log)
        {
            log.LogInformation($"Triggered AddComment");

            if (thread == null)
            {
                throw new System.Exception("Invalid clientId, id combination");
            }

            if (thread.comments == null)
            {
                thread.comments = new List<ThreadComment>();
            }

            thread.comments.Add(commentDTO.comment);

            log.LogInformation($"Inserting Thread:{thread.id}");
            try
            {
                await threadsOut.AddAsync(thread);
                return new JsonResult(new Result<Thread>() { Payload = thread });
            }
            catch (Exception e)
            {
                return new JsonResult(new Result<Thread>() { Error = e.Message });
            }
        }
    }
}
