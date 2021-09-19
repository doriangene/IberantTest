using System.Collections.Immutable;
using Microsoft.AspNet.OData.Query;
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
        #region Properties

        public readonly IUserServices UserServices;

        #endregion

        #region Constructor

        public UserController(IUserServices userServices)
        {
            UserServices = userServices;
        }

        #endregion

        #region Public Methods

        // GET
        [HttpGet]
        public IActionResult Get(ODataQueryOptions<User> options)
        {
            var users = UserServices.GetAll();

            return Ok(new QueryResult<User>(users, users.Count));
        }
        
        // GET {id}
        [HttpGet("{id}", Name = "GetUser")]
        public IActionResult Get(int id)
        {
            return Ok(UserServices.Get(id));
        }
        
        // PUT
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] User item)
        {
            UserServices.Put(id, item);

            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }
        
        // POST
        [HttpPost]
        public IActionResult Post([FromBody] UserDTO itemDto)
        {
            var id = UserServices.Add(itemDto);

            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }
        
        // DELETE
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            UserServices.Delete(id);

            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }

        #endregion
    }
}