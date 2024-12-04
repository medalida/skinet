using Core.Interfaces;

namespace Core.Entities.OrderAggregate;

public class Order : BaseEntity, IDtoConvertible
{
    public DateTime OrderDate { get; set; }
    public OrderStatus Status { get; set; }
    public required string BuyerEmail { get; set; }
    public required ShippingAddress ShippingAddress { get; set; }
    public required PaymentSummary PaymentSummary { get; set; }
    
    public required DeliveryMethod DeliveryMethod { get; set; }
    public required List<OrderItem> OrderItems { get; set; }
    public decimal Subtotal { get; set; }
    public required string PaymentIntentId { get; set; }

    public decimal GetTotal()
    {
        return Subtotal + DeliveryMethod.Price;
    }
}