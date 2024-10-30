using Core.Entities;

namespace Core.Interfaces;

public interface IGenericRepository<T> where T : BaseEntity
{
    Task<IReadOnlyList<T>> ListAllAsync();
    
    Task<T?> GetByIdAsync(int id);
    
    Task<T?> GetEntityWithSpec(ISpecification<T> spec);
    
    Task<IReadOnlyList<T?>> ListAsync(ISpecification<T> spec);
    
    void Add(T entity);
    
    void Update(T entity);
    
    void Remove(T entity);
    
    bool Exists(int id);
    
    public Task<bool> SaveAllAsync();
}