using System;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using SessionFeed.Models;

namespace SessionFeed
{
    public static class AddComment
    {
        [FunctionName("AddComment")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] CommentDTO commentDTO,
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
