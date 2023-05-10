using Microsoft.AspNet.OData.Query;
using Microsoft.AspNetCore.Mvc;
using PackingList.Core.Queries;
using PackingListApp.DTO;
using PackingListApp.Interfaces;
using PackingListApp.Models;
using PackingListApp.Services;

namespace PackingListApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        public readonly IUsuarioServices _usuarioService;
        public UsuarioController(IUsuarioServices usuarioservice)
        {
            _usuarioService = usuarioservice;
        }

        // GET: api/usuario

        [HttpGet]        
        public IActionResult Get(ODataQueryOptions<UsuarioModel> options)
        {
            var list = _usuarioService.GetAll();
            return Ok(new QueryResult<UsuarioModel>(list, list.Count));
        }

        // GET: api/usuario/5
        [HttpGet("{id}", Name = "user")]
        public IActionResult Get(int id)
        {
            return Ok(_usuarioService.Get(id));
        }

        // POST: api/usuario
        [HttpPost]        
        public IActionResult Post([FromBody] DTOUsuario value)
        {
            var id = _usuarioService.Add(value);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));

        }

        [HttpPut("{id}")]        
        public IActionResult Put(int id, [FromBody] UsuarioModel item)
        {
            _usuarioService.Put(id, item);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }
    }
}
