using Microsoft.AspNet.OData.Query;
using Microsoft.AspNetCore.Mvc;
using PackingList.Core.Queries;
using PackingListApp.DTO;
using PackingListApp.Interfaces;
using PackingListApp.Models;

namespace PackingListApp.Controllers
{
    [Route("api/User")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public readonly IUserServices userService;
        public UserController(IUserServices userService)
        {
            this.userService = userService;
        }
        // GET: api/User
        [HttpGet]
        public IActionResult Get(ODataQueryOptions<UserModel> options)
        {
            var list = userService.GetAll();
            return Ok(new QueryResult<UserModel>(list, list.Count));
        }

        // GET: api/User/1
        [HttpGet("{id}", Name = "GetUser")]
        public IActionResult Get(int id)
        {
            return Ok(userService.Get(id));
        }

        // POST: api/User
        [HttpPost]
        public IActionResult Post([FromBody] NewUserModel value)
        {
            var id = userService.Add(value);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));

        }

        [HttpPut("{id}")]

        public IActionResult Put(int id, [FromBody] UserModel item)
        {
            userService.Put(id, item);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }
    }
}
