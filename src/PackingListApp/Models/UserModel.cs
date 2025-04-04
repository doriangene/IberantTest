using System.ComponentModel.DataAnnotations;

namespace PackingListApp.Models
{
    public class UserModel
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
    }
}
