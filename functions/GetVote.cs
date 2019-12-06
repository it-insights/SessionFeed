using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.Documents.Client;
using System.Collections.Generic;
using Microsoft.Azure.Documents.Linq;
using System.Linq;
using SessionFeed.Models;

namespace SessionFeed
{
    public static class GetVote
    {
        [FunctionName("GetVote")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetVote/{user}")] HttpRequest req,
            [CosmosDB(
                databaseName: Constants.DatabaseName,
                collectionName: Constants.VotesCollectionName,
                ConnectionStringSetting = Constants.ConnectionStringName,
                SqlQuery = "select * from " + Constants.VotesCollectionName + " r where r.author = {user}")
            ] IEnumerable<Vote> voteItems,
            ILogger log)
        {
            try
            {
                return new JsonResult(new Result<Vote>() { Payload = voteItems.FirstOrDefault() });
            }
            catch (Exception e)
            {
                return new JsonResult(new Result<Vote>() { Error = e.Message });
            }
        }
    }
}
