using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using PackingListApp.Controllers;
using PackingListApp.EntityFramework;
using PackingListApp.Services;
using System;
using ApplicationContext = PackingListApp.EntityFramework.ApplicationContext;

namespace PackingListApp.Tests
{
    [SetUpFixture]
    public class GlobalFixture
    {
        public static ApplicationContext _context { get; private set; }

        [OneTimeSetUp]
        public void OneTimeSetUp()
        {
            var options = new DbContextOptionsBuilder<ApplicationContext>()
             .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
             .Options;

            _context = new ApplicationContext(options);
        }

        [OneTimeTearDown]
        public void OneTimeTearDown()
        {
            _context.Dispose();
        }
    }


}
