namespace SessionFeed.Models
{
    public class Result<T>
    {
        public string Error { get; set; }
        public T Payload { get; set; }
    }
}