using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.OData.Query;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PackingList.Core.Queries;
using PackingListApp.Interfaces;
using PackingListApp.Models;

namespace PackingListApp.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public readonly IUserServices _userService;
        public UserController(IUserServices userService)
        {
            _userService = userService;
        }
        // GET: api/users
        [HttpGet]
        public async Task<IActionResult> Get(ODataQueryOptions<User> options)
        {
            var list = await _userService.GetAll();
            return Ok(new QueryResult<User>(list, list.Count));
        }

        // GET: api/users/5
        [HttpGet("{id}", Name = "Get User")]
        public async Task<IActionResult> Get(int id)
        {
            return Ok(await _userService.Get(id));
        }

        // POST: api/users
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] UserAddInput value)
        {
            var id = await _userService.Add(value);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] UserUpdateInput item)
        {
            await _userService.Put(id, item);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _userService.Delete(id);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }
    }
}
