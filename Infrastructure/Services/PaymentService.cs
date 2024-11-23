using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;
using Product = Core.Entities.Product;

namespace Infrastructure.Services;

public class PaymentService(
    IConfiguration config, 
    ICartService cartService, 
    IGenericRepository<Product> productRepo, 
    IGenericRepository<DeliveryMethod>dmRepo
    ) : IPaymentService
{
    public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];
        var cart = await cartService.GetCartAsync(cartId);
        if (cart == null) return null;
        var shippingPrice = 0m;
        if (cart.DeliveryMethodId.HasValue)
        {
            var deliveryMethod = await dmRepo.GetByIdAsync(cart.DeliveryMethodId.Value);
            if (deliveryMethod == null) return null;
            shippingPrice = deliveryMethod.Price;
        }

        foreach (var item in cart.Items)
        {
            var productItem = await productRepo.GetByIdAsync(item.ProductId);
            if (productItem == null) return null;
            item.Price = productItem.Price;
        }

        var paymentIntentService = new PaymentIntentService();
        var amount = (long)cart.Items.Sum(i => i.Quantity * i.Price * 100) + (long)shippingPrice * 100;
        if (string.IsNullOrEmpty(cart.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = amount,
                Currency = "eur",
                PaymentMethodTypes = ["card"]
            };
            var intent = await paymentIntentService.CreateAsync(options);
            cart.PaymentIntentId = intent.Id;
            cart.ClientSecret = intent.ClientSecret;
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = amount
            };
            await paymentIntentService.UpdateAsync(cart.PaymentIntentId, options);
        }

        await cartService.SetCartAsync(cart);
        return cart;
    }
}