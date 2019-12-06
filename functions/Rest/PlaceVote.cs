using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using SessionFeed.Models;

namespace SessionFeed
{
    public static class PlaceVote
    {
        [FunctionName("PlaceVote")]
        public static async Task<ActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
            HttpRequestMessage req,
            [CosmosDB(
                Constants.DatabaseName,
                Constants.VotesCollectionName,
                CreateIfNotExists = true,
                ConnectionStringSetting = Constants.ConnectionStringName)]
            IAsyncCollector<Vote> votesOut,
            ILogger log)
        {
            var vote = await req.Content.ReadAsAsync<Vote>();
            log.LogInformation("PlaceVote triggered");
            try
            {
                await votesOut.AddAsync(vote);
                return new OkObjectResult("Vote place succeeded");
            }
            catch (Exception e)
            {
                return new BadRequestObjectResult("Vote place failed");
            }
        }
    }
}