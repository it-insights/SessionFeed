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
    public static class AddThread
    {
        public class Thread
        {
            public string clientId { get; set; }
            public string id { get; set; }
            public DateTime timestamp { get; set; }
            public string author { get; set; }
            public string text { get; set; }
        }

        [FunctionName("AddThread")]
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
            log.LogInformation("AddThread triggered");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);

            var threadItem = new Thread
            {
                clientId = data.clientId,
                id = data.id,
                timestamp = data.timestamp,
                author = data.author,
                text = data.text
            };

            log.LogInformation($"Inserting Thread:{threadItem.text}");
            await threadsOut.AddAsync(threadItem);
        }
    }
}
