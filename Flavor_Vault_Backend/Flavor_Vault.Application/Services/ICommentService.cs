using Flavor_Vault.Application.DTOs;
using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Application.Services
{
    public interface ICommentService
    {
        public Task<(IEnumerable<CommentsWithUserDTO> Comments, int TotalCount)> GetPaginatedCommentsAsync(int page, int pageSize);
        public Task AddCommentAsync(CommentWithoutIdDTO commentWithoutIdDTO);
        public Task DeleteCommentAsync(int id);
    }
}
