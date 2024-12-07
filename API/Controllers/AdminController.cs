using API.DTOs;
using API.Extensions;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Roles = "Admin")]
public class AdminController(IUnitOfWork unit, IPaymentService paymentService) : BaseApiController
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

    [HttpPost("orders/refund/{id:int}")]
    public async Task<ActionResult<OrderDto>> RefundOrder(int id)
    {
        var order = await unit.Repository<Order>().GetEntityWithSpec(new OrderSpecification(id));
        if (order == null) return BadRequest("No oder with Id " + id);
        if (order.Status == OrderStatus.Pending) return BadRequest("Payment not received yet for this order");
        var success = await paymentService.RefundPayment(order.PaymentIntentId);
        if (success)
        {
            order.Status = OrderStatus.Refunded;
            await unit.Complete();
            return order.ToDto();
        }
        return BadRequest("Problem refunding payment");
    }
}