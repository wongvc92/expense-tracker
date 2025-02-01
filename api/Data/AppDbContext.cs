using api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<ApplicationUser>(options)
    {

        public DbSet<Transaction> Transactions { get; set; }
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
                entity.HasKey(us => us.Id);
                entity.HasIndex(us => us.SessionKey).IsUnique();
                entity.Property(us => us.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(us => us.IsRevoked).HasDefaultValue(false);

                entity.HasOne<ApplicationUser>()
                      .WithMany()
                      .HasForeignKey(us => us.UserId)
                      .OnDelete(DeleteBehavior.Cascade); // Delete sessions if user is deleted
            });

            // Fix the Transactions Foreign Keys
            builder.Entity<Transaction>()
                .HasOne(t => t.Income)
                .WithMany(i => i.Transactions)
                .HasForeignKey(t => t.IncomeId)
                .OnDelete(DeleteBehavior.NoAction); // 👈 Prevents cascading delete conflicts

            builder.Entity<Transaction>()
                .HasOne(t => t.Expense)
                .WithMany(e => e.Transactions)
                .HasForeignKey(t => t.ExpenseId)
                .OnDelete(DeleteBehavior.NoAction); // 👈 Prevents cascading delete conflicts
        }

    }
}