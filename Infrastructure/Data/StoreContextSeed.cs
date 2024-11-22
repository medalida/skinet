﻿using System.Text.Json;
using Core.Entities;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data;

public class StoreContextSeed
{
    public static async Task SeedAsync(StoreContext context)
    {
        if (!context.Products.Any())
        {
            var productsData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/products.json");

            var products = JsonSerializer.Deserialize<List<Product>>(productsData);

            if (products == null) return;

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
        }
        
        if (!context.DeliveryMethods.Any())
        {
            var deliveryData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/delivery.json");

            var deliveryMethods = JsonSerializer.Deserialize<List<DeliveryMethod>>(deliveryData);

            if (deliveryMethods == null) return;

            await context.DeliveryMethods.AddRangeAsync(deliveryMethods);
            await context.SaveChangesAsync();
        }
    }
}