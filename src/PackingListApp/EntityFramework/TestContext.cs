using Microsoft.EntityFrameworkCore;
using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.EntityFramework
{
    public class TestContext : DbContext
    {
        private bool _initialized;

        public TestContext(DbContextOptions<TestContext> options) : base(options)
        {
            if (!_initialized)
            {
                if (Database.ProviderName != "Microsoft.EntityFrameworkCore.InMemory")
                {
                    // Use Entity Framework migrations
                    Database.Migrate();
                }
                _initialized = true;
            }
        }
        public DbSet<TestModel> TestModels { get; set; }
        public DbSet<UserModel> UserModels { get; set; }
    }
}
