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
using SessionFeed.Models;

namespace SessionFeed
{
    public static class CreateUser
    {
        [FunctionName("CreateUser")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] User user,
            [CosmosDB(
                databaseName: Constants.DatabaseName,
                collectionName: Constants.UsersCollectionName,
                ConnectionStringSetting = Constants.ConnectionStringName,
                SqlQuery = "select * from " + Constants.UsersCollectionName + " r where r.name = {name}")
            ] IEnumerable<User> userItems,
            [CosmosDB(
                databaseName: Constants.DatabaseName,
                collectionName: Constants.UsersCollectionName,
                CreateIfNotExists = true,
                ConnectionStringSetting = Constants.ConnectionStringName)]
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