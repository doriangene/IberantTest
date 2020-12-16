using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace PackingListApp.Models
{
    public enum AdminType { Normal, VIP, King }

    public class MyUser
    {
        [Key]
        public int Id { get; set; }
        
        public string Name { get; set; }
        
        public string LastName { get; set; }
        
        public string Address { get; set; }

        [MaxLength(10)]
        public string Description { get; set; }
        
        public bool IsAdmin { get; set; }

        public AdminType AdminType { get; set; }

        public override string ToString() => JsonConvert.SerializeObject(this);
    }
}
