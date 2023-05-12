using PackingListApp.Models.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Models
{
    public class UserModel
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Lastname { get; set; }

        [MaxLength(10)]
        public string Address { get; set; }
        public bool IsAdmin { get; set; }
        public AdminType AdminType { get; set; }
    }
}
