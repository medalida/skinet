using API.Extensions;
using API.SignalR;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Stripe;

namespace API.Controllers;

[Authorize]
public class PaymentsController(
    IPaymentService paymentService, 
    IUnitOfWork unit, 
    ILogger<PaymentsController> logger, 
    IConfiguration config,
    IHubContext<NotificationHub> hubContext) : BaseApiController
{
    private readonly string _whSecret = config["StripeSettings:WhSecret"]!;

    [HttpPost("{cartId}")]
    public async Task<ActionResult<ShoppingCart>> CreateOrUpdatePaymentIntent(string cartId)
    {
        var cart = await paymentService.CreateOrUpdatePaymentIntent(cartId);
        if (cart == null) return BadRequest("Problem with your cart");
        return Ok(cart);
    }

    [AllowAnonymous]
    [HttpGet("delivery-methods")]
    public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
    {
        return Ok(await unit.Repository<DeliveryMethod>().ListAllAsync());
    }

    [AllowAnonymous]
    [HttpPost("webhook")]
    public async Task<IActionResult> StripWebhook()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();
        try
        {
            var stripeEvent = ConstructStripeEvent(json);
            if (stripeEvent.Data.Object is not PaymentIntent intent) return BadRequest("Invalid event data");
            await HandlePaymentIntentSucceeded(intent);
            return Ok();
        }
        catch (StripeException e)
        {
            logger.LogError(e, "Stripe webhook exception");
            return StatusCode(StatusCodes.Status500InternalServerError, "Webhook error");
        } catch (Exception e)
        {
            logger.LogError(e, "An unexpected error occurred");
            return StatusCode(StatusCodes.Status500InternalServerError, "");
        }
    }

    private async Task HandlePaymentIntentSucceeded(PaymentIntent intent)
    {
        if (intent.Status != "succeeded") return;
        
        var spec = new OrderSpecification(intent.Id, true);
        var order = await unit.Repository<Order>().GetEntityWithSpec(spec) ?? throw new Exception("Order not found");
        order.Status = (long)order.GetTotal() * 100 == intent.Amount
            ? OrderStatus.PaymentReceived
            : OrderStatus.PaymentMismatch;
        await unit.Complete();
        var connectionId = NotificationHub.GetConnectionIdByEmail(order.BuyerEmail);
        if (!string.IsNullOrEmpty(connectionId))
        {
            await hubContext.Clients.Client(connectionId).SendAsync("OrderCompleteNotification", order.ToDto());
        }
    }

    private Event ConstructStripeEvent(string json)
    {
        try
        {
            foreach (var header in Request.Headers)
            {
                Console.WriteLine($"{header.Key}: {string.Join(", ", header.Value.ToString())}");
            }
            return EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], _whSecret);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to construct stripe event");
            throw new StripeException("Invalid signature", e);
        }
    }
}