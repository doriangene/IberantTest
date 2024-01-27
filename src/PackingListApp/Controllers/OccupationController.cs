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
    [Route("api/occupation")]
    [ApiController]
    public class OccupationController : ControllerBase
    {
        public readonly IOccupationServices _testService;
        public OccupationController(IOccupationServices testService)
        {
            _testService = testService;
        }
        // GET: api/occupation
        [HttpGet]
        public IActionResult Get(ODataQueryOptions<Occupation> options)
        {
            var list = _testService.GetAll();
            return Ok(new QueryResult<Occupation>(list, list.Count));
        }

        // GET: api/occupation/5
        [HttpGet("{id}", Name = "GetOccupation")]
        public IActionResult Get(int id)
        {
            return Ok(_testService.Get(id));
        }

        // POST: api/occupation
        [HttpPost]
        public IActionResult Post([FromBody] NewOccupation value)
        {
            var id = _testService.Add(value);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));

        }

        // PUT: api/occupation/5
        [HttpPut("{id}")]
        public  IActionResult Put(int id, [FromBody] Occupation item)
        {
            _testService.Put(id, item);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }

        // DELETE: api/occupation/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _testService.Delete(id);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }
    }
}
