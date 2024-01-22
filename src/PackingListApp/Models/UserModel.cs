using PackingListApp.Enums;
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
        public string LastName { get; set; }
        
        [MaxLength(10)]
        public string Direction { get; set; }
        public bool IsAdmin { get; set; }
        public adminType AdminType { get; set; }
        public OccupationModel Occupation { get; set; }
    }
}
