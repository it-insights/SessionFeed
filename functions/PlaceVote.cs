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

namespace SessionFeed
{
    public static class PlaceVote
    {
        public class VoteCategory
        {
            public string name { get; set; }
            public int rating { get; set; }
        }

        public class Vote
        {
            public List<VoteCategory> categories { get; set; }
            public string author { get; set; }
            public string email { get; set; }
            public string comment { get; set; }
        }
        
        [FunctionName("PlaceVote")]
        public static async Task<ActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequestMessage req,
            [CosmosDB(
            databaseName: "sessionfeed",
            collectionName: "signalrtchvotes",
            CreateIfNotExists = true,
            ConnectionStringSetting = "CosmosDBConnection")]
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
