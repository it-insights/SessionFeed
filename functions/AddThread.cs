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
    public static class AddThread
    {
        [FunctionName("AddThread")]
        public static async Task<ActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] Thread threadItem,
            [CosmosDB(
            databaseName: Constants.DatabaseName,
            collectionName: Constants.ThreadsCollectionName,
            CreateIfNotExists = true,
            ConnectionStringSetting = Constants.ConnectionStringName)]
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
