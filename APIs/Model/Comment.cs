using System.ComponentModel.DataAnnotations.Schema;

namespace APIs.Model
{
    public class Comment
    {
        public int Id { get; set; }
        public int PostId { get; set; }
        public required string Author { get; set; }
        public required string Body { get; set; } = string.Empty;
    }
}
