using System.Reflection;
using System.Text.Json;
using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data;

public class StoreContextSeed
{
    public static async Task SeedAsync(StoreContext context, UserManager<AppUser> userManger)
    {
        if (!userManger.Users.Any(u => u.Email == "admin@admin.com"))
        {
            var admin = new AppUser
            {
                Email = "admin@admin.com",
                UserName = "admin@admin.com",
            };
            await userManger.CreateAsync(admin, "Pa$$w0rd");
            await userManger.AddToRoleAsync(admin, "Admin");
        }
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        
        if (!context.Products.Any())
        {
            var productsData = await File.ReadAllTextAsync(path + @"/Data/SeedData/products.json");

            var products = JsonSerializer.Deserialize<List<Product>>(productsData);

            if (products == null) return;

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
        }
        
        if (!context.DeliveryMethods.Any())
        {
            var deliveryData = await File.ReadAllTextAsync(path + @"/Data/SeedData/delivery.json");

            var deliveryMethods = JsonSerializer.Deserialize<List<DeliveryMethod>>(deliveryData);

            if (deliveryMethods == null) return;

            await context.DeliveryMethods.AddRangeAsync(deliveryMethods);
            await context.SaveChangesAsync();
        }
    }
}