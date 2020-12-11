using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace PackingListApp.Models
{
    public class MyUser
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public override string ToString() => JsonConvert.SerializeObject(this);
    }
}
