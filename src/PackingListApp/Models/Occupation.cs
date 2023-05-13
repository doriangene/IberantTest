using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Models
{
    public class Occupation
    {
        public Occupation()
        {
            Users = new HashSet<UserModel>();
        }
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public virtual ICollection<UserModel> Users { get; set; }
    }
}
