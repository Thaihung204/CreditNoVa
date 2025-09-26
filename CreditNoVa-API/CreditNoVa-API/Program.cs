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

            // Swagger/OpenAPI
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Đăng ký DbContext
            builder.Services.AddDbContext<CreditNovaContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("CreditNovaDb")));

            // Đăng ký repository & service
            builder.Services.AddScoped<IRepository, EntityFrameworkRepository<CreditNovaContext>>();
            builder.Services.AddScoped<ICreditSurveyService, CreditSurveyService>();
            builder.Services.AddHttpContextAccessor();

            // Đăng ký CORS trước khi build app
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                    // Chú ý: AllowCredentials() không thể dùng cùng AllowAnyOrigin()
                });
            });

            var app = builder.Build();

            // Middleware pipeline
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // Dùng CORS
            app.UseCors("AllowFrontend");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}