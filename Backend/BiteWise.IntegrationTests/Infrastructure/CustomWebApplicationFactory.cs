using System;
using System.Linq;
using BiteWise.DAL.Context;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace BiteWise.IntegrationTests.Infrastructure
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Program>
    {
        private Microsoft.Data.Sqlite.SqliteConnection _connection;

        public CustomWebApplicationFactory()
        {
            _connection = new Microsoft.Data.Sqlite.SqliteConnection("DataSource=:memory:");
            _connection.Open();
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                // Крок 1 — видалити реальну реєстрацію DbContext
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                // Крок 2 — зареєструвати SQLite in-memory DbContext
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlite(_connection));

                // Крок 3 — ініціалізувати схему БД
                var sp = services.BuildServiceProvider();
                using var scope = sp.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                db.Database.EnsureCreated();
            });
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            _connection?.Close();
            _connection?.Dispose();
        }
    }
}
