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

namespace SessionFeed
{
    public static class GetVote
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

        public class Result<T>
        {
            public string Error { get; set; }
            public T Payload { get; set; }
        }


        [FunctionName("GetVote")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetVote/{user}")] HttpRequest req,
            [CosmosDB(
                databaseName: "sessionfeed",
                collectionName: "signalrtchvotes",
                ConnectionStringSetting = "CosmosDBConnection",
                SqlQuery = "select * from signalrtchvotes r where r.author = {user}")
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
