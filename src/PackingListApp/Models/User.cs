using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Name field is required.")]
        public string Name { get; set; }
        [Required(ErrorMessage = "LastName field is required.")]
        public string LastName { get; set; }
        [Required(ErrorMessage = "Address field is required.")]
        [MaxLength(10, ErrorMessage = "Address field cannot be more than 10 characters.")]
        public string Address { get; set; }
        [DefaultValue(false)]
        public bool IsAdmin { get; set; } = false;

        [ForeignKey("OccupationId")]
        public int? OccupationId { get; set; }
        public Occupation Occupation { get; set; }
        [DefaultValue(AdminType.NONE)]
        public AdminType AdminType { get; set; } = AdminType.NONE;
    }

    public enum AdminType
    {
        NONE,
        NORMAL,
        VIP,
        KING
    }
}
