using PackingListApp.Enums;

namespace PackingListApp.DTO
{
    public class NewUserModel
    {
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public bool IsAdmin { get; set; }
        public AdminType AdminType { get; set; }
        public int? OccupationModelId { get; set; }
    }
}
