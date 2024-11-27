using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;

namespace API.Controllers;

public class ProductsController(IUnitOfWork unit) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery]ProductSpecParams productSpecParams)
    {
        return await CreatePagedResult(unit.Repository<Product>(), new ProductSpecification(productSpecParams), productSpecParams.PageIndex,
            productSpecParams.PageSize);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await unit.Repository<Product>().GetByIdAsync(id);

        if (product == null) return NotFound();
        
        return product;
    }
    
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        unit.Repository<Product>().Add(product);

        if (await unit.Complete())
        {
            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }

        return BadRequest("Problem while creating product");
    }
    
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, Product product)
    {
        if (id != product.Id || !unit.Repository<Product>().Exists(id)) return BadRequest("Cannot update this product :(");
        
        unit.Repository<Product>().Update(product);
        
        if (await unit.Complete())
        {
            return NoContent();
        }
        return BadRequest("Problem while updating product");
    }
    
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await unit.Repository<Product>().GetByIdAsync(id);

        if (product == null) return NotFound();
        
        unit.Repository<Product>().Remove(product);
        
        if (await unit.Complete())
        {
            return NoContent();
        }
        return BadRequest("Problem while deleting product");
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IEnumerable<string>>> GetBrands()
    {
        return Ok(await unit.Repository<Product>().ListAsync(new BrandListSpecification()));
    }
    
    [HttpGet("types")]
    public async Task<ActionResult<IEnumerable<string>>> GetTypes()
    {
        return Ok(await unit.Repository<Product>().ListAsync(new TypeListSpecification()));
    }
}