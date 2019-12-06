using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

namespace SessionFeed
{
    public static class Negotiate
    {
        private const string HubName = "sessionfeedbroadcaster";

        [FunctionName("Negotiate")]
        public static SignalRConnectionInfo Run(
            [HttpTrigger(AuthorizationLevel.Anonymous)]
            HttpRequest req,
            [SignalRConnectionInfo(HubName = HubName)]
            SignalRConnectionInfo connectionInfo)
        {
            return connectionInfo;
        }
    }
}