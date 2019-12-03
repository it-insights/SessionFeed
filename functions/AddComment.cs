using System;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace SessionFeed
{
    public static class AddComment
    {
        public class ThreadComment
        {
            public DateTime timestamp { get; set; }
            public string author { get; set; }
            public string text { get; set; }
        }

        public class Thread
        {
            public string id { get; set; }
            public string clientId { get; set; }
            public DateTime timestamp { get; set; }
            public string author { get; set; }
            public string text { get; set; }
            public List<ThreadComment> comments { get; set; }
            public List<string> likedBy { get; set; }
        }

        public class CommentDTO
        {
            public string clientId { get; set; }
            public string id { get; set; }
            public ThreadComment tcomment { get; set; }
        }

        [FunctionName("AddComment")]
        public static async Task Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] CommentDTO comment,
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
            log.LogInformation($"{comment.tcomment}");

            //string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            //dynamic data = JsonConvert.DeserializeObject(requestBody);

            // thread.comments.Add(comment.comment);

            log.LogInformation($"Inserting Thread:{thread.id}");
            await threadsOut.AddAsync(thread);
        }
    }
}
