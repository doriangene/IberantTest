using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Models
{
    public class NewUserModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public bool IsAdmin { get; set; }
        public AdminType? AdminType { get; set; }
        public int OccupationId { get; set; }
        public OccupationModel? Occupation { get; set; }
    }
}
