using System.Text;
using BiteWise.BLL.Interfaces;
using BiteWise.BLL.Services;
using BiteWise.DAL.Context;
using BiteWise.DAL.Interfaces;
using BiteWise.DAL.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

// Load .env file (TraversePath шукає файл .env у поточній та всіх батьківських папках)
DotNetEnv.Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

// 1. Додаємо контролери
builder.Services.AddControllers();

// 2. Підключаємо базу даних PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Додаємо Redis (Distributed Cache)
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";
    options.InstanceName = "BiteWise_";
});

// 3. Реєстрація залежностей (Dependency Injection)
// Add Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IFoodEntryRepository, FoodEntryRepository>();

// Add Services
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IDiaryService, DiaryService>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddHttpClient<IFatSecretAuthService, FatSecretAuthService>();
builder.Services.AddHttpClient<INutritionService, NutritionService>();
builder.Services.AddHttpClient<IMLServiceClient, MLServiceClient>();

// 4. Налаштування JWT Авторизації
var jwtSettings = builder.Configuration.GetSection("Jwt");
// Отримуємо секретний ключ з .env (перевизначає appsettings.json)
var jwtKeyString = Environment.GetEnvironmentVariable("JWT_KEY") ?? jwtSettings["Key"];

if (string.IsNullOrEmpty(jwtKeyString))
{
    throw new InvalidOperationException("JWT_KEY is missing! Make sure .env file is loaded properly.");
}

var key = Encoding.ASCII.GetBytes(jwtKeyString);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Введіть JWT токен у форматі: Bearer {ваші_цифри_та_літери}"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Важливо: Authentication має бути ПЕРЕД Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
