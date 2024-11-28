﻿using Core.Entities.OrderAggregate;

namespace API.DTOs;

public class OrderItemDto
{
    public int Id { get; set; }
    
    public required string ProductName { get; set; }
    
    public required string PictureUrl { get; set; }
    
    public decimal Price { get; set; }
    
    public int Quantity { get; set; }
}