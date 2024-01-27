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

        [Required]
        public string Name { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [MaxLength(10)]
        public string Address { get; set; }

        [Required]
        public bool IsAdmin { get; set; }

        public AdminType AdminType { get; set; }

        public int? OccupationId { get; set; }
        public Occupation Occupation { get; set; }
    }
}
