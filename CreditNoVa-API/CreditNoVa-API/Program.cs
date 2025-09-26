
using Microsoft.EntityFrameworkCore;
using CreditNoVa_API.WebApp.Models;
using CreditNoVa_API.Services.Interfaces;
using CreditNoVa_API.Services;
using CreditNoVa_API.WebApp.Services.Interfaces;

namespace CreditNoVa_API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            // Đăng ký DbContext
            builder.Services.AddDbContext<CreditNovaContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("CreditNovaDb")));
            builder.Services.AddScoped<IRepository, EntityFrameworkRepository<CreditNovaContext>>();
            builder.Services.AddScoped<ICreditSurveyService, CreditSurveyService>();
            builder.Services.AddHttpContextAccessor();
            
            // Thêm CORS với credentials support
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:3000", "https://localhost:3000", "http://116.105.30.238:3000", "https://116.105.30.238:3000")
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials();
                    });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // app.UseHttpsRedirection(); // Tắt HTTPS redirect
            
            app.UseCors("AllowFrontend");
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
