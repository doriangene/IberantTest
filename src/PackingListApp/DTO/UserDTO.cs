using PackingListApp.Models;

namespace PackingListApp.DTO
{
    public class UserDTO
    {
        #region Properties
        
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public bool IsAdmin { get; set; }
        public AdminType AdminType { get; set; }

        #endregion
    }
}