namespace Core.Entities.OrderAggregate;

public class OrderItem : BaseEntity
{
    public required ProductItemOrdered ProductItemOrdered { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}