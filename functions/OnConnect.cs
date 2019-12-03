// Default URL for triggering event grid function in the local environment.
// http://localhost:7071/runtime/webhooks/EventGrid?functionName={functionname}
using System;
using System.Threading.Tasks;
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace SessionFeed
{
    public static class OnConnect
    {
        private const string HubName = "sessionfeedbroadcaster";

        public class SignalREvent
        {
            public DateTime Timestamp { get; set; }
            public string HubName { get; set; }
            public string ConnectionId { get; set; }
            public string UserId { get; set; }
        }

        [FunctionName("OnConnect")]
        public static Task Run(
            [EventGridTrigger]EventGridEvent eventGridEvent,
            [SignalR(HubName = HubName)]IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger log)
        {
            var eventMessage = ((JObject)eventGridEvent.Data).ToObject<SignalREvent>();
            var hubName = eventMessage.HubName;
            var message = "test";

            return signalRMessages.AddAsync(
                new SignalRMessage
                {
                    UserId = eventMessage.UserId,
                    Target = "message",
                    Arguments = new[] { message }
                });
        }
    }
}
