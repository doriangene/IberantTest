using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.DTO {
    public class NewMyUserModel {
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
