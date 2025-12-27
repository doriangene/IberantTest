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
        public string LastName {get; set; }
        [MaxLength(10, ErrorMessage = "La dirección no puede exceder 10 caracteres.")]
        public string Address { get; set; }

        public bool isAdmin { get; set; }
        public AdminCategory Category { get; set; }
    }
}
