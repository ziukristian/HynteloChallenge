using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace APIs.Model
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Post>()
                .HasMany(c => c.Comments)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade);
        }

        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
    }
}
