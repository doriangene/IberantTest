using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.DTO
{
    public class NewUserModel
    {
        public string Name { get; set; }
        public string LastNames { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public bool IsAdmin { get; set; }
        public string AdminType { get; set; }
    }
}
