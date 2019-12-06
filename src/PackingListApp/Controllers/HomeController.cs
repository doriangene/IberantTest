using Microsoft.AspNetCore.Mvc;

namespace PackingListApp.Controllers
{
    [Route("home")]
    [ApiController]
    public class HomeController : ControllerBase
    {

        [HttpGet("online")]
        public string IsOnline()
        {
            return "Hello world";
        }
    }
}
