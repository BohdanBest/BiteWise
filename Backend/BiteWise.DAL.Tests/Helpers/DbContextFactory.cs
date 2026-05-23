using System;
using BiteWise.DAL.Context;
using Microsoft.EntityFrameworkCore;

namespace BiteWise.DAL.Tests.Helpers
{
    public static class DbContextFactory
    {
        public static ApplicationDbContext Create()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            var context = new ApplicationDbContext(options);
            context.Database.EnsureCreated();
            return context;
        }
    }
}
