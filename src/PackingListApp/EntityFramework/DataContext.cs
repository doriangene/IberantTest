﻿using Microsoft.EntityFrameworkCore;
using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.EntityFramework
{
    public class DataContext : DbContext
    {
        private bool _initialized;
        public DbSet<Occupation> Occupations { get; set; }
        public DbSet<User> Users { get; set; }

        public DataContext(DbContextOptions<DataContext> options) : base(options)
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.Occupation)
                .WithMany()
                .HasForeignKey(u => u.OccupationId)
                .OnDelete(DeleteBehavior.SetNull);
            //modelBuilder.Entity<Occupation>()
            //    .HasIndex(o => new { o.Title })
            //    .IsUnique();
            //modelBuilder.Entity<User>()
            //    .HasIndex(u => new { u.Name, u.LastName, u.Address })
            //    .IsUnique();
        }
    }
}
