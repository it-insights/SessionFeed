using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

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
            public ThreadComment comments { get; set; }
            public string[] likedBy { get; set; }
        }

        [FunctionName("AddComment")]
        public static async Task Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
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
            log.LogInformation("AddComment triggered");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);

            var threadItem = new Thread
            {
                author = thread.author,
                timestamp = thread.timestamp,
                text = thread.text,
                likedBy = thread.likedBy,
                clientId = data.clientId,
                id = data.id,
                comments = data.comments.ToObject<ThreadComment[]>()
            };

            log.LogInformation($"Inserting Thread:{threadItem.id}");
            await threadsOut.AddAsync(threadItem);
        }
    }
}
