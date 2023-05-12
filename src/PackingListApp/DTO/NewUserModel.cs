using PackingListApp.Models.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Models
{
    public class NewUserModel
    {
        public string Name { get; set; }
        public string Lastname { get; set; }
        public string Address { get; set; }
        public bool IsAdmin { get; set; }
        public AdminType AdminType { get; set; }
    }
}
