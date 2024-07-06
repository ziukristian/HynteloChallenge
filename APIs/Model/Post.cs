using System.ComponentModel.DataAnnotations.Schema;

namespace APIs.Model
{
    public class Post
    {
        public int Id { get; set; }
        public required string Author { get; set; }
        public required string Title { get; set; }
        public string Body {  get; set; } = string.Empty;
        public ICollection<Comment> Comments { get; set; } = [];

    }
}
