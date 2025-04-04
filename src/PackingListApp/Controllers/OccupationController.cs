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
        public readonly IOccupationServices _occupationService;
        public OccupationController(IOccupationServices occupationService)
        {
            _occupationService = occupationService;
        }
        // GET: api/Test
        [HttpGet]
        public IActionResult Get(ODataQueryOptions<OccupationModel> options)
        {
            var list = _occupationService.GetAll();
            return Ok(new QueryResult<OccupationModel>(list, list.Count));
        }

        // GET: api/Test/5
        [HttpGet("{id}", Name = "Get")]
        public IActionResult Get(int id)
        {
            return Ok(_occupationService.Get(id));
        }

        // POST: api/Test
        [HttpPost]
        public IActionResult Post([FromBody] NewOccupationModel value)
        {
            var id = _occupationService.Add(value);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));

        }

        [HttpPut("{id}")]

        public  IActionResult Put(int id, [FromBody] OccupationModel item)
        {
            _occupationService.Put(id, item);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }
    }
}
