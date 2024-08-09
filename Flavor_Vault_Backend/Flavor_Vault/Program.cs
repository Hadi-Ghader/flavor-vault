using System.Text;
using Flavor_Vault.Application.Mappings;
using Flavor_Vault.Application.Services;
using Flavor_Vault.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Flavor_Vault
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            var config = builder.Configuration;
            var jwtKey = config["Jwt:Key"];
            var encodedKey = Encoding.UTF8.GetBytes(jwtKey!);
            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    //ValidIssuer = config["Jwt:Issuer"],
                    //ValidAudience = config["Jwt:Audience"],
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(encodedKey),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  policy =>
                                  {
                                      policy.WithOrigins("http://localhost:3000")
                                            .AllowAnyHeader()
                                            .AllowAnyMethod()
                                            .AllowCredentials();
                                  });
            });

            builder.Services.AddSingleton(new JwtTokenGenerator(builder.Configuration["Jwt:Key"]!));
            builder.Services.AddAuthorization();
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddAutoMapper(typeof(MappingProfile));

            builder.Services.AddScoped<IUserRepository, UserRepository>(provider => new UserRepository(connectionString!));
            builder.Services.AddScoped<IRecipeRepository, RecipeRepository>(provider => new RecipeRepository(connectionString!));
            builder.Services.AddScoped<ICategoryRepository, CategoryRepository>(provider => new CategoryRepository(connectionString!));
            builder.Services.AddScoped<IFavoriteRepository, FavoriteRepository>(provider => new FavoriteRepository(connectionString!));
            builder.Services.AddScoped<ILikeRepository, LikeRepository>(provider => new LikeRepository(connectionString!));

            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IRecipeService, RecipeService>();
            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<IFavoriteService, FavoriteService>();
            builder.Services.AddScoped<ILikeService, LikeService>();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors(MyAllowSpecificOrigins);

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
