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
    public class OccupationController : ControllerBase
    {
        public readonly IOccupationServices _testService;
        public OccupationController(IOccupationServices testService)
        {
            _testService = testService;
        }
        // GET: api/occupation
        [HttpGet]
        public IActionResult Get(ODataQueryOptions<OccupationModel> options)
        {
            var list = _testService.GetAll();
            return Ok(new QueryResult<OccupationModel>(list, list.Count));
        }

        // GET: api/occupation/5
        [HttpGet("{id}", Name = "Get")]
        public IActionResult Get(int id)
        {
            return Ok(_testService.Get(id));
        }

        // POST: api/occupation
        [HttpPost]
        public IActionResult Post([FromBody] NewOccupationModel value)
        {
            var id = _testService.Add(value);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));

        }

        [HttpPut("{id}")]

        public  IActionResult Put(int id, [FromBody] OccupationModel item)
        {
            _testService.Put(id, item);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }
    }
}
