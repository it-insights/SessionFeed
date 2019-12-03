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
    public static class Like
    {

        public class Thread
        {
            public string id { get; set; }
            public string author { get; set; }
            public string[] likedBy { get; set; }
        }

        [FunctionName("Like")]
        public static async Task Run(
                [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
                [CosmosDB(
                databaseName: "sessionfeed",
                collectionName: "signalrtch",
                CreateIfNotExists = true,
                ConnectionStringSetting = "CosmosDBConnection")]
                IAsyncCollector<Thread> threadsOut,
                ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);

            var threadItem = new Thread
            {
                id = data.id,
                likedBy = data.likedBy.ToObject<string[]>().append(data.author)
            };

            log.LogInformation($"Inserting Thread:{threadItem.id}");
            await threadsOut.AddAsync(threadItem);
        }
    }
}
