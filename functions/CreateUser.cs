using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using System.Linq;
using System.Collections.Generic;

namespace SessionFeed
{
    public static class CreateUser
    {
        public class User
        {
            public string name { get; set; }
            public string avatarUrl { get; set; }
        }

        [FunctionName("CreateUser")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] User user,
            [CosmosDB(
                databaseName: "sessionfeed",
                collectionName: "signalrtch",
                ConnectionStringSetting = "CosmosDBConnection")] DocumentClient client,
            ILogger log)
        {
            log.LogInformation("Triggered CreateUser");

            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("sessionfeed", "signalrtch");
            IDocumentQuery<User> query = client.CreateDocumentQuery<User>(collectionUri, new FeedOptions { EnableCrossPartitionQuery = true }).Where(p => p.name.Equals(user.name)).AsDocumentQuery();
            List<User> userList = new List<User>();
            while (query.HasMoreResults)
            {
                foreach (User result in await query.ExecuteNextAsync())
                {
                    userList.Add(result);
                }
            }

            if (userList.Count > 0)
            {
                return new BadRequestObjectResult("Username already taken");
            }
            else
            {
                return new OkObjectResult("Ok");
            }
        }
    }
}
