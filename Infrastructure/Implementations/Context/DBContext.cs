using MicroservicesArchitecture.Domain.Entities.Students;
using MicroservicesArchitecture.Domain.EntityConfigurations;
using Microsoft.EntityFrameworkCore;

namespace MicroservicesArchitecture.Infrastructure.Implementations.Context
{
    public class DBContext : DbContext
    {
        public DBContext(DbContextOptions<DBContext> options) : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Moved all Student related configuration to StudentEntityConfiguration class
            modelBuilder.ApplyConfiguration<Student>(new StudentEntityConfiguration());
        }
    }
}
