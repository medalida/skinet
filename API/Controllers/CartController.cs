using Core.Entities;
using Core.Interfaces;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController(ICartService cartService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ShoppingCart>> GetCartById(string id)
    {
        return Ok(await cartService.GetCartAsync(id) ?? new ShoppingCart{Id = id});
    }
    
    [HttpPost]
    public async Task<ActionResult<ShoppingCart>> UpdateCart(ShoppingCart cart)
    {
        Console.WriteLine(cart.Items.Count);
        var updatedCart = await cartService.SetCartAsync(cart);
        if (updatedCart == null) return BadRequest("Product with cart");
        return Ok(updatedCart);
    }
    
    [HttpDelete]
    public async Task<ActionResult> DeleteCart(string id)
    {
        var deleted = await cartService.DeleteCartAsync(id);
        if (!deleted) return BadRequest("Product with deleting cart");
        return Ok();
    }
}