using System;

namespace SessionFeed.Models
{
    public class SignalREvent
    {
        public DateTime Timestamp { get; set; }
        public string HubName { get; set; }
        public string ConnectionId { get; set; }
        public string UserId { get; set; }
    }
}