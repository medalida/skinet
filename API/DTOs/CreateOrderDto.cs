using Core.Entities.OrderAggregate;

namespace API.DTOs;

public class CreateOrderDto
{
    public required string CartId { get; set; }
    public int DeliveryMethodId { get; set; }
    public required ShippingAddress ShippingAddress { get; set; }
    public required PaymentSummary PaymentSummary { get; set; }
}