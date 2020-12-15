namespace PackingListApp.Models {
    public class NewMyUser {
        public string Name { get; set; }

        public string LastName { get; set; }

        public string Address { get; set; }

        public string Description { get; set; }

        public bool IsAdmin { get; set; }

        public AdminType AdminType { get; set; }


        public void Deconstruct(
            out string name, out string lastName, out string address,
            out string description, out bool isAdmin, out AdminType adminType) {
            
            name = Name;
            lastName = LastName;
            address = Address;
            description = Description;
            isAdmin = IsAdmin;
            adminType = AdminType;
        }
    }
}
