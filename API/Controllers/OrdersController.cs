using System.Security.Claims;
using API.DTOs;
using API.Extensions;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class OrdersController(ICartService cartService, IUnitOfWork unit) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderDto createOrderDto)
    {
        var email = User.GetEmail();
        var cart = await cartService.GetCartAsync(createOrderDto.CartId);
        if (cart == null) return BadRequest("Cart not found");
        if (cart.PaymentIntentId == null) return BadRequest("Cart payment intent not found");
        var items = new List<OrderItem>();
        foreach (var item in cart.Items)
        {
            var productItem = await unit.Repository<Product>().GetByIdAsync(item.ProductId);
            if (productItem == null) return BadRequest("Product with id : " + item.ProductId + " is not found");
            var itemOrdered = new ProductItemOrdered
            {
                ProductId = productItem.Id,
                ProductName = productItem.Name,
                PictureUrl = productItem.PictureUrl,
            };
            var orderItem = new OrderItem
            {
                ProductItemOrdered = itemOrdered,
                Price = productItem.Price,
                Quantity = item.Quantity
            };
            items.Add(orderItem);
        }

        var deliveryMethod = await unit.Repository<DeliveryMethod>().GetByIdAsync(createOrderDto.DeliveryMethodId);
        if (deliveryMethod == null) return BadRequest("Delivery Method with id : " + createOrderDto.DeliveryMethodId + " is not found");
        var order = new Order
        {
            BuyerEmail = email,
            PaymentIntentId = cart.PaymentIntentId,
            ShippingAddress = createOrderDto.ShippingAddress,
            OrderItems = items,
            PaymentSummary = createOrderDto.PaymentSummary,
            DeliveryMethod = deliveryMethod,
            Status = OrderStatus.Pending,
            OrderDate = DateTime.Now,
            Subtotal = items.Sum(x => x.Price * x.Quantity)
        };
        unit.Repository<Order>().Add(order);
        if (await unit.Complete()) return Ok(order.ToDto());
        return BadRequest("Failed to create order");
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetOrdersForUser()
    {
        var spec = new OrderSpecification(User.GetEmail());
        var orders = await unit.Repository<Order>().ListAsync(spec);
        return Ok(orders.Select(o => o.ToDto()).ToList());
    }
    
    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(int id)
    {
        var spec = new OrderSpecification(User.GetEmail(), id);
        var order = await unit.Repository<Order>().GetEntityWithSpec(spec);
        if (order == null) return NotFound();
        return Ok(order.ToDto());
    }
}