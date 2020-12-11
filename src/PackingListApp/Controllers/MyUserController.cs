using System.Linq;
using Microsoft.AspNet.OData.Query;
using Microsoft.AspNetCore.Mvc;
using PackingList.Core.Queries;
using PackingListApp.Models;
using PackingListApp.Services;
using PackingListApp.Interfaces;


namespace PackingList.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class MyUserController : ControllerBase {

        public IMyUserService myUserService { get; }

        public MyUserController(IMyUserService myUserService) {
            this.myUserService = myUserService;
        }

        // GET: api/MyUser
        [HttpGet]
        public IActionResult Get(ODataQueryOptions<MyUser> options) {
            var list = myUserService.GetAll().ToList();
            return Ok(new QueryResult<MyUser>(list, list.Count));
        }

        // GET: api/MyUser/<id>
        [HttpGet("{id}", Name = "GetMyUser")]
        public IActionResult Get(int id) {
            return Ok(myUserService.Get(id));
        }

        // POST: api/MyUser
        [HttpPost]
        public IActionResult Post([FromBody] NewMyUser value) {
            var id = myUserService.Add(value);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] MyUser item) {
            myUserService.Put(id, item);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }
    }
}