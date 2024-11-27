using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Config;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.OwnsOne(o => o.ShippingAddress, o => o.WithOwner());
        builder.OwnsOne(o => o.PaymentSummary, o => o.WithOwner());
        builder.Property(o => o.OrderStatus).HasConversion(
            s => s.ToString(), 
            s => (OrderStatus)Enum.Parse(typeof(OrderStatus), s)
            );
        builder.Property(o=> o.Subtotal).HasColumnType("decimal(18,2)");
        builder.HasMany(o => o.OrderItems).WithOne().OnDelete(DeleteBehavior.Cascade);
        builder.Property(o => o.OrderDate).HasConversion(
            d => d.ToUniversalTime(),
            d => DateTime.SpecifyKind(d, DateTimeKind.Utc)
            );
    }
}