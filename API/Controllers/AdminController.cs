using API.DTOs;
using API.Extensions;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Roles = "Admin")]
public class AdminController(IUnitOfWork unit) : BaseApiController
{
    [HttpGet("orders")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders([FromQuery] OrderSpecParams specParams)
    {
        return await CreatePagedResult(unit.Repository<Order>(), new OrderSpecification(specParams), specParams.PageIndex,
            specParams.PageSize, o => o.ToDto()); 
    }
    
    [HttpGet("orders/{id:int}")]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
    {
        var order = await unit.Repository<Order>().GetEntityWithSpec(new OrderSpecification(id));
        if (order == null) return NotFound();
        return order.ToDto();
    }
    
}