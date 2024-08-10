using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Infrastructure.Repositories
{
    public interface ICommentRepository
    {
        public Task<int> GetTotalCommentsCountAsync();
        public Task<IEnumerable<CommentsWithUser>> GetPaginatedCommentsAsync(int page, int pageSize);
        public Task AddCommentAsync(Comment comment);
        public Task DeleteCommentAsync(int id);
    }
}
