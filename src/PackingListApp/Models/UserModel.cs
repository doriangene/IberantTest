using PackingListApp.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PackingListApp.Models
{
    public class UserModel
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }

        public int? OccupationModelId { get; set; }
        
 
        [ForeignKey(nameof(OccupationModelId))]
        public virtual OccupationModel Occupation {get; set;}

        [MaxLength(10)]
        public string Address { get; set; }
        public bool IsAdmin { get; set; }
        public AdminType AdminType { get; set; }
    }
}
