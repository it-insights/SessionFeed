using System;

namespace SessionFeed.Models
{
    public class ThreadComment
    {
        public DateTime timestamp { get; set; }
        public User author { get; set; }
        public string text { get; set; }
    }
}