using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{
    protected async Task<ActionResult<IEnumerable<T>>> CreatePagedResult<T>(IGenericRepository<T> repo, ISpecification<T> spec, int pageIndex,
        int pageSize) where T : BaseEntity
    {
        var items = await repo.ListAsync(spec);
        var count = await repo.CountAsync();
        var result = new Pagination<T>(pageIndex, pageSize, count, items);
        return Ok(result);
    }
}