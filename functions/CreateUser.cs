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

        public class Result<T>
        {
            public string Error { get; set; }
            public T Payload { get; set; }
        }

        [FunctionName("CreateUser")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] User user,
            [CosmosDB(
                databaseName: "sessionfeed",
                collectionName: "users",
                ConnectionStringSetting = "CosmosDBConnection",
                SqlQuery = "select * from users r where r.name = {name}")
            ] IEnumerable<User> userItems,
            [CosmosDB(
            databaseName: "sessionfeed",
            collectionName: "users",
            CreateIfNotExists = true,
            ConnectionStringSetting = "CosmosDBConnection")]
            IAsyncCollector<User> usersOut,
            ILogger log)
        {
            log.LogInformation("Triggered CreateUser");
            try
            {
                if (userItems.Any<User>())
                {
                    JsonResult response = new JsonResult(new Result<User> { Error = "Username already taken", Payload = userItems.FirstOrDefault() });
                    response.StatusCode = 409;
                    return response;
                }
                await usersOut.AddAsync(user);
                return new JsonResult(new Result<User>() { Payload = user });
            }
            catch (Exception e)
            {
                return new JsonResult(new Result<User>() { Error = e.Message });
            }
        }
    }
}
