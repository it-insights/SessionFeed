using System;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using SessionFeed.Models;

namespace SessionFeed
{
    public static class Like
    {
        [FunctionName("Like")]
        public static async Task Run(
                [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] LikeDTO likeDTO,
                [CosmosDB(
                databaseName: Constants.DatabaseName,
                collectionName: Constants.ThreadsCollectionName,
                CreateIfNotExists = true,
                ConnectionStringSetting = Constants.ConnectionStringName)]
                IAsyncCollector<Thread> threadsOut,
                [CosmosDB(
                databaseName: Constants.DatabaseName,
                collectionName: Constants.ThreadsCollectionName,
                ConnectionStringSetting = Constants.ConnectionStringName,
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
