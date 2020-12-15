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

    public class UserModel
    {
        [Key]
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        
        [MaxLength(10)]
        public string Description { get; set; }
        public bool IsAdmin { get; set; }
        public AdminType AdminType { get; set; }

    }
}
