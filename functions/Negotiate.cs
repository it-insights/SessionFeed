using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Azure.SignalR.Management;
using Microsoft.Azure.SignalR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace SessionFeed
{
    public static class Negotiate
    {
        private const string HubName = "sessionfeedbroadcaster";

        [FunctionName("negotiate")]
        public static SignalRConnectionInfo Run(
            [HttpTrigger(AuthorizationLevel.Anonymous)]HttpRequest req,
            [SignalRConnectionInfo(HubName = HubName)]SignalRConnectionInfo connectionInfo)
        {
            return connectionInfo;
        }
    }
}
