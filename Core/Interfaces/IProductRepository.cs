using Core.Entities;

namespace Core.Interfaces;

public interface IProductRepository
{
    
    Task<IReadOnlyList<string>> GetBrandsAsync();
    
    Task<IReadOnlyList<string>> GetTypesAsync();
}