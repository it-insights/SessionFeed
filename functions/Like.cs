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

        public class Thread
        {
            public string id { get; set; }
            public List<string> likedBy { get; set; }
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
            Thread data = JsonConvert.DeserializeObject<Thread>(requestBody);

            log.LogInformation($"Inserting Thread:{data.id}");
            await threadsOut.AddAsync(data);
        }
    }
}
