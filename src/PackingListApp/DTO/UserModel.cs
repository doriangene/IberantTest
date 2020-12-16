using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static PackingListApp.Models.UserModel;

namespace PackingListApp.Models
{
    public class NewUserModel
    {
        public string Name { get; set; }
        
        public string Lastname { get; set; }
        
        public string Address { get; set; }

        public bool IsAdmin { get; set; }

        public _AdminType AdminType { get; set; }
    }
}
