using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Models
{
    public class UserModel
    {
        [Key]
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [MaxLength(10)]
        public string Address { get; set; }
        public bool IsAdmin { get; set; }
        public AdminType? AdminType { get; set; }
        public int OccupationId { get; set; }
        [ForeignKey("OccupationId")]
        public OccupationModel? Occupation { get; set; }
    }
    // Enum para el tipo de administrador
    public enum AdminType
    {
        Normal,
        Vip,
        King
    }
}
