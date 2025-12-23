using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Models
{
    public enum AdminType
    {
        Normal,
        Vip,
        King
    }

    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string LastNames { get; set; }
        public string Address { get; set; }
        public bool IsAdmin { get; set; }
        public AdminType? AdminType { get; set; }
    }
}

