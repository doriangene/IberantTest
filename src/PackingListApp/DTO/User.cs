using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Models
{
    public class UserAddInput
    {
        [Required(ErrorMessage = "Name field is required.")]
        public string Name { get; set; }
        [Required(ErrorMessage = "LastName field is required.")]
        public string LastName { get; set; }
        [Required(ErrorMessage = "Address field is required.")]
        public string Address { get; set; }
        public int? OccupationId { get; set; }
        public bool IsAdmin { get; set; }
        public int AdminType { get; set; }
    }

    public class UserUpdateInput
    {
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public int? OccupationId { get; set; }
        public bool IsAdmin { get; set; }
        public int AdminType { get; set; }
    }
}
