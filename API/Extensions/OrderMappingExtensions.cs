using API.DTOs;
using Core.Entities;
using Core.Entities.OrderAggregate;

namespace API.Extensions;

public static class OrderMappingExtensions
{
    public static OrderDto ToDto(this Order order)
    {
        ArgumentNullException.ThrowIfNull(order);
        return new OrderDto
        {
            Id = order.Id,
            BuyerEmail = order.BuyerEmail,
            OrderDate = order.OrderDate,
            OrderItems = order.OrderItems.Select(i => i.ToDto()).ToList(),
            Status = order.Status.ToString(),
            ShippingAddress = order.ShippingAddress,
            DeliveryMethod = order.DeliveryMethod.Description,
            ShippingPrice = order.DeliveryMethod.Price,
            PaymentSummary = order.PaymentSummary,
            Subtotal = order.Subtotal,
            Total = order.GetTotal()
        };
    }

    private static OrderItemDto ToDto(this OrderItem orderItem)
    {
        ArgumentNullException.ThrowIfNull(orderItem);
        return new OrderItemDto
        {
            Id = orderItem.Id,
            ProductName = orderItem.ProductItemOrdered.ProductName,
            PictureUrl = orderItem.ProductItemOrdered.PictureUrl,
            Price = orderItem.Price,
            Quantity = orderItem.Quantity
        };
    }
}