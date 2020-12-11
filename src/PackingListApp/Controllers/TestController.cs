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
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        public readonly ITestServices _testService;
        public TestController(ITestServices testService)
        {
            _testService = testService;
        }
        // GET: api/Test
        [HttpGet]
        public IActionResult Get(ODataQueryOptions<TestModel> options)
        {
            var list = _testService.GetAll();
            return Ok(new QueryResult<TestModel>(list, list.Count));
        }

        // GET: api/Test/5
        [HttpGet("{id}", Name = "GetUserById")]
        public IActionResult Get(int id)
        {
            return Ok(_testService.Get(id));
        }

        // POST: api/Test
        [HttpPost]
        public IActionResult Post([FromBody] NewTestModel value)
        {
            var id = _testService.Add(value);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));

        }

        [HttpPut("{id}")]

        public  IActionResult Put(int id, [FromBody] TestModel item)
        {
            _testService.Put(id, item);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }
    }
}
