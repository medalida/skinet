using Core.Interfaces;

namespace Core.Entities;

public class Product : BaseEntity
{
    public required string Name { get; set; }

    public required string Description { get; set; }
    
    public decimal Price { get; set; }
    
    public required string PictureUrl { get; set; }
    
    public required string Type { get; set; } = string.Empty;
    
    public required string Brand { get; set; } = string.Empty;
    
    public int QuantityInStock { get; set; }
}