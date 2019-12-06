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
using System.Net.Http;
using SessionFeed.Models;

namespace SessionFeed
{
    public static class PlaceVote
    {
        [FunctionName("PlaceVote")]
        public static async Task<ActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequestMessage req,
            [CosmosDB(
            databaseName: Constants.DatabaseName,
            collectionName: Constants.VotesCollectionName,
            CreateIfNotExists = true,
            ConnectionStringSetting = Constants.ConnectionStringName)]
            IAsyncCollector<Vote> votesOut,
            ILogger log)
        {
            Vote vote = await req.Content.ReadAsAsync<Vote>();
            log.LogInformation("PlaceVote triggered");
            try
            {
                await votesOut.AddAsync(vote);
                return (ActionResult)new OkObjectResult("Vote place succeeded");
            }
            catch (Exception e)
            {
                return (ActionResult)new BadRequestObjectResult("Vote place failed");
            }
        }
    }
}
