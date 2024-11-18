using System.Security.Authentication;
using System.Security.Claims;
using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static async Task<AppUser> GetUserByEmailAsync(this UserManager<AppUser> userManager, ClaimsPrincipal user)
    {
        return await userManager.Users.FirstOrDefaultAsync(x => x.Email == GetEmail(user)) ?? throw new AuthenticationException("User not found");;
    }

    private static string GetEmail(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.Email) ?? throw new AuthenticationException("Email claim not found");
    }
    
    public static async Task<AppUser> GetUserByEmailWithAddressAsync(this UserManager<AppUser> userManager, ClaimsPrincipal user)
    {
        return await userManager.Users.Include(x => x.Address).FirstOrDefaultAsync(x => x.Email == GetEmail(user)) ?? throw new AuthenticationException("User not found");;
    }
}