using AutoMapper;
using Flavor_Vault.Application.DTOs;
using Flavor_Vault.Core.Entities;
using Flavor_Vault.Infrastructure.Repositories;

namespace Flavor_Vault.Application.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _commentRepository;
        private readonly IMapper _mapper;

        public CommentService(ICommentRepository commentRepository, IMapper categoryMapper)
        {
            _commentRepository = commentRepository;
            _mapper = categoryMapper;
        }

        public async Task<(IEnumerable<CommentsWithUserDTO> Comments, int TotalCount)> GetPaginatedCommentsAsync(int page, int pageSize)
        {
            var commentsWithUser = await _commentRepository.GetPaginatedCommentsAsync(page, pageSize);
            var totalCount = await _commentRepository.GetTotalCommentsCountAsync();

            var commentsWithUserDTO = _mapper.Map<IEnumerable<CommentsWithUserDTO>>(commentsWithUser);

            return (commentsWithUserDTO, totalCount);
        }

        public async Task AddCommentAsync(CommentWithoutIdDTO commentWithoutIdDTO)
        {
            var commentWithoutId = _mapper.Map<Comment>(commentWithoutIdDTO);

            await _commentRepository.AddCommentAsync(commentWithoutId);
        }

        public async Task DeleteCommentAsync(int id)
        {
            await _commentRepository.DeleteCommentAsync(id);
        }
    }
}
