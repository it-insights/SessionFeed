using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace signalrtchdemo
{
    public static class messages
    {
        [FunctionName("messages")]
        public static Task Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] object message,
            [SignalR(HubName = "signalrtchdemo")] IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger log)
        {
            return signalRMessages.AddAsync( new SignalRMessage { Target = "newMessage", Arguments = new[] { message } });
        }
    }
}
