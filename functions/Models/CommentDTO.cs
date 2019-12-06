namespace SessionFeed.Models
{
    public class CommentDTO
    {
        public string clientId { get; set; }
        public string id { get; set; }
        public ThreadComment comment { get; set; }
    }
}