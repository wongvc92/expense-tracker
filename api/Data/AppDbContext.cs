using api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<ApplicationUser>(options)
    {
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<UserSession> UserSessions { get; set; }
        public DbSet<Income> Incomes { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>()
                .HasIndex(u => u.Email)
                .IsUnique();

            builder.Entity<ApplicationUser>()
                .HasIndex(u => u.GoogleId)
                .IsUnique(); // Enforces uniqueness

            builder.Entity<UserSession>(entity =>
            {
                entity.HasKey(us => us.Id); // Primary key
                entity.HasIndex(us => us.SessionKey).IsUnique(); // Unique session key
                entity.Property(us => us.CreatedAt).HasDefaultValueSql("GETDATE()"); // Default value for CreatedAt
                entity.Property(us => us.IsRevoked).HasDefaultValue(false); // Default value for IsRevoked

                // Configure relationship with User entity
                entity.HasOne<ApplicationUser>() // Foreign key relationship
                      .WithMany() // No navigation property in User
                      .HasForeignKey(us => us.UserId)
                      .OnDelete(DeleteBehavior.Cascade); // Cascade delete sessions when user is deleted
            });
        }
    }
}