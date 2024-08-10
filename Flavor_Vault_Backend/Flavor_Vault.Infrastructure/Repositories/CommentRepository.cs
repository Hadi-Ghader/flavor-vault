using Dapper;
using Flavor_Vault.Core.Entities;
using Npgsql;
using System.Data;

namespace Flavor_Vault.Infrastructure.Repositories
{
    public class CommentRepository : ICommentRepository
    {
        private readonly string _connectionString;

        public CommentRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        private IDbConnection Connection => new NpgsqlConnection(_connectionString);

        public async Task<int> GetTotalCommentsCountAsync()
        {
            using var dbConnection = Connection;
            const string countQuery = @"SELECT COUNT(*) FROM public.""comments"";";

            return await dbConnection.ExecuteScalarAsync<int>(countQuery);
        }

        public async Task<IEnumerable<CommentsWithUser>> GetPaginatedCommentsAsync(int page, int pageSize)
        {
            using var dbconnection = Connection;
            const string query = @"
                                    SELECT c.id, c.body, c.user_id AS userId, c.recipe_id AS recipeId, u.name
                                    FROM public.""comments"" c
                                    JOIN users u ON u.id =  c.user_id
                                    ORDER BY c.id
                                    OFFSET @Offset LIMIT @Limit;";

            var commentsWithUser = await dbconnection.QueryAsync<CommentsWithUser>(query, new
            {
                Offset = (page - 1) * pageSize,
                Limit = pageSize
            });

            return commentsWithUser;
        }


        public async Task AddCommentAsync(Comment comment)
        {
            using var dbconnection = Connection;
            const string query = @"INSERT INTO public.""comments"" (body, user_id, recipe_id) 
                                   VALUES (@Body, @UserId, @RecipeId) ;";

            await dbconnection.ExecuteAsync(query, new
            {
                Body = comment.Body,
                UserId = comment.UserId,
                RecipeId = comment.RecipeId
            });
        }

        public async Task DeleteCommentAsync(int id)
        {
            using var dbconnection = Connection;
            const string query = @"DELETE FROM public.""comments"" WHERE id = @Id ;";

            await dbconnection.ExecuteAsync(query, new
            {
                Id = id
            });
        }
    }
}
