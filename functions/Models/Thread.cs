using System;
using System.Collections.Generic;

namespace SessionFeed.Models
{
    public class Thread
    {
        public string clientId { get; set; }
        public string id { get; set; }
        public DateTime timestamp { get; set; }
        public User author { get; set; }
        public string text { get; set; }
        public List<ThreadComment> comments { get; set; }
        public List<string> likedBy { get; set; }
    }
}