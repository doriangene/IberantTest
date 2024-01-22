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
    [Route("api/Occupation")]
    [ApiController]
    public class OccupationController : ControllerBase
    {
        public readonly IOccupationServices _testService;
        public OccupationController(IOccupationServices testService)
        {
            _testService = testService;
        }
        // GET: api/Occupation
        [HttpGet]
        public IActionResult Get(ODataQueryOptions<OccupationModel> options)
        {
            var list = _testService.GetAll();
            return Ok(new QueryResult<OccupationModel>(list, list.Count));
        }

        // GET: api/Occupation/5
        [HttpGet("{id}", Name = "Get")]
        public IActionResult Get(int id)
        {
            return Ok(_testService.Get(id));
        }

        // POST: api/Occupation
        [HttpPost]
        public IActionResult Post([FromBody] NewOccupationModel value)
        {
            var id = _testService.Add(value);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));

        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] OccupationModel item)
        {
            _testService.Put(id, item);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _testService.Delete(id);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }
    }
}
