using Microsoft.EntityFrameworkCore;
using PackingListApp.Models;

namespace PackingListApp.EntityFramework {
    public class PackingListAppContext : DbContext {
        private bool _initialized;

        public PackingListAppContext(DbContextOptions<PackingListAppContext> options) : base(options) {
            if (!_initialized) {
                if (Database.ProviderName != "Microsoft.EntityFrameworkCore.InMemory") {
                    // Use Entity Framework migrations
                    Database.Migrate();
                }
                _initialized = true;
            }
        }
        public DbSet<TestModel> TestModels { get; set; }
        public DbSet<MyUser> MyUsers { get; set; }

    }
}
