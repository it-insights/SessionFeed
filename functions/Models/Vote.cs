using System.Collections.Generic;

namespace SessionFeed.Models
{
    public class Vote
    {
        public List<VoteCategory> categories { get; set; }
        public string author { get; set; }
        public string email { get; set; }
        public string comment { get; set; }
    }
}