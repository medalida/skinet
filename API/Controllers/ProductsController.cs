using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(StoreContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        Env.Load();
        Console.WriteLine("this is : " + Env.GetString("DEFAULT_CONNECTION_STRING"));
        Environment.Exit(1);
        return await context.Products.ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await context.Products.FindAsync(id);

        if (product == null) return NotFound();
        
        return product;
    }
    
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        context.Products.Add(product);

        await context.SaveChangesAsync();
        
        return product;
    }
    
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, Product product)
    {
        if (id != product.Id || !ProductExists(id)) return BadRequest("Cannot update this product :(");
        
        context.Products.Update(product);
        
        await context.SaveChangesAsync();
        
        return NoContent();
    }
    
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await context.Products.FindAsync(id);

        if (product == null) return NotFound();

        context.Products.Update(product);
        
        await context.SaveChangesAsync();
        
        return NoContent();
    }
    
    private bool ProductExists(int id) => context.Products.Any(p => p.Id == id);
}