namespace PackingListApp.Models {
    public class NewMyUser {
        public string Name { get; set; }

        public string LastName { get; set; }

        public string Address { get; set; }

        public void Deconstruct(out string name, out string lastName, out string address) {
            name = Name;
            lastName = LastName;
            address = Address;
        }
    }
}
