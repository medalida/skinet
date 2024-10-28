using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class ProductRepository(StoreContext context) : IProductRepository
{
    public async Task<IReadOnlyList<Product>> GetProductsAsync()
    {
        return await context.Products.ToListAsync();
    }

    public async Task<Product?> GetProductByIdAsync(int id)
    {
        return new Product{Name = "sdfo", Description = "sdfp", PictureUrl = "fso", Brand = "sdfp", Type = "sdfp"};
    }

    public void AddProduct(Product product)
    {
        context.Products.Add(product);
    }

    public void UpdateProduct(Product product)
    {
        context.Products.Update(product);
    }

    public void DeleteProduct(Product product)
    {
        context.Products.Remove(product);
    }

    public bool ProductExists(int id)
    {
        return context.Products.Any(e => e.Id == id);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}