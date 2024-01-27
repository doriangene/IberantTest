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
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public readonly IUserServices _testService;
        public UserController(IUserServices testService)
        {
            _testService = testService;
        }
        // GET: api/user
        [HttpGet]
        public IActionResult Get(ODataQueryOptions<User> options)
        {
            var list = _testService.GetAll();
            return Ok(new QueryResult<User>(list, list.Count));
        }

        // GET: api/user/5
        [HttpGet("{id}", Name = "Get")]
        public IActionResult Get(int id)
        {
            return Ok(_testService.Get(id));
        }

        // POST: api/user
        [HttpPost]
        public IActionResult Post([FromBody] NewUser value)
        {
            var id = _testService.Add(value);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));

        }

        // PUT: api/user/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] User item)
        {
            _testService.Put(id, item);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }

        // DELETE: api/user/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _testService.Delete(id);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }
    }
}
