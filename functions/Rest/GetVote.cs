using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using SessionFeed.Models;

namespace SessionFeed
{
    public static class GetVote
    {
        [FunctionName("GetVote")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetVote/{user}")]
            HttpRequest req,
            [CosmosDB(
                Constants.DatabaseName,
                Constants.VotesCollectionName,
                ConnectionStringSetting = Constants.ConnectionStringName,
                SqlQuery = "select * from " + Constants.VotesCollectionName + " r where r.author = {user}")
            ]
            IEnumerable<Vote> voteItems,
            ILogger log)
        {
            try
            {
                return new JsonResult(new Result<Vote> {Payload = voteItems.FirstOrDefault()});
            }
            catch (Exception e)
            {
                return new JsonResult(new Result<Vote> {Error = e.Message});
            }
        }
    }
}