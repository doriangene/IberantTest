using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        [MaxLength(10)]
        public string Address { get; set; }
        public bool IsAdmin { get; set; }
        public string AdminType { get; set; }
        public Occupation Occupation { get; set; }
    }
}
