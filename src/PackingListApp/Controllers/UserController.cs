using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.OData.Query;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PackingList.Core.Queries;
using PackingListApp.DTO;
using PackingListApp.Interfaces;
using PackingListApp.Models;

namespace PackingListApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public readonly IUserServices _userService;

        public UserController(IUserServices userServices)
        {
            _userService = userServices;
        }

        // GET: api/user
        [HttpGet]
        public IActionResult Get(ODataQueryOptions<UserModel> options)
        {
            try
            {
                var list = _userService.GetAll();
                return Ok(new QueryResult<UserModel>(list, list.Count));
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
                
        }

        // GET: api/user/5
        [HttpGet("{id}", Name ="Get")]
        public IActionResult Get(int id)
        {
            try
            {
                return Ok(_userService.Get(id));
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // POST: api/user
        [HttpPost]
        public IActionResult Post([FromBody] NewUserModel value)
        {
            try
            {
                var id = _userService.Add(value);
                return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // DELETE: api/user/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] UserModel item)
        {
            try
            {
                _userService.Put(id, item);
                return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _userService.Delete(id);
                return Ok(id);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        }
    }
}
