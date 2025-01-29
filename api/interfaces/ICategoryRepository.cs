

using api.Models;

namespace api.interfaces
{
    public interface ICategoryRepository
    {
        public Task<Category?> GetCategoryByIdAsync(int id);
    }
}