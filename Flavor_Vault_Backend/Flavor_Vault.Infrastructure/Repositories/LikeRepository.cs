﻿using System.Data;
using Dapper;
using Flavor_Vault.Core.Entities;
using Npgsql;

namespace Flavor_Vault.Infrastructure.Repositories
{
    public class LikeRepository : ILikeRepository
    {
        private readonly string _connectionString;

        public LikeRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        private IDbConnection Connection => new NpgsqlConnection(_connectionString);

        public async Task<bool> UserHasLikedAsync(int userId, int recipeId)
        {
            using var dbconnection = Connection;
            const string query = @"SELECT COUNT(*) FROM public.""likes"" WHERE user_id = @UserId AND recipe_id = @RecipeId";

            var count = await dbconnection.ExecuteScalarAsync<int>(query, new
            {
                UserId = userId,
                RecipeId = recipeId
            });

            return count > 0;
        }

        public async Task AddLikeAsync(Like like)
        {

            using var dbconnectipon = Connection;
            const string query = @"INSERT INTO public.""likes"" (user_id, recipe_id) VALUES (@UserId, @RecipeId) ";

            await dbconnectipon.ExecuteAsync(query, new { 
                UserId = like.UserId,
                RecipeId = like.RecipeId
            });
        }

        public async Task<int> GetAllLikesAsync(int id)
        {
            using var dbconnectipon = Connection;
            const string query = @"SELECT COUNT(*) FROM public.""likes"" WHERE recipe_id = @RecipeId ";

            var count = await dbconnectipon.ExecuteScalarAsync<int>(query, new { 
                RecipeId = id 
            });

            return count;
        }
    }
}
