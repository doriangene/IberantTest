using System;
using System.ComponentModel.DataAnnotations;

namespace PackingListApp.Models
{
    public enum AdminType {Normal, Vip, King}
    public class User
    {
        #region Properties
        [Key]
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        [MaxLength(10)]
        public string Description { get; set; }
        public bool IsAdmin { get; set; }
        public AdminType AdminType { get; set; }
        
        #endregion
    }
}