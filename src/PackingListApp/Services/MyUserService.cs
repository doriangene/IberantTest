using System.Collections.Generic;
using System.Linq;
using PackingListApp.EntityFramework;
using PackingListApp.Interfaces;
using PackingListApp.Models;

namespace PackingListApp.Services {
    public class MyUserService : IMyUserService {

        private readonly PackingListAppContext _context;

        public MyUserService(PackingListAppContext context) {
            _context = context;
        }

        public int Add(NewMyUser usermodel) {
            (
                string name,
                string lastName,
                string address,
                string description,
                bool isAdmin,
                AdminType adminType) = usermodel;

            // Saving instance...
            var newUser = new MyUser() {
                Name = name,
                LastName = lastName,
                Address = address,
                Description = description,
                IsAdmin = isAdmin,
                AdminType = adminType
            };
            _context.MyUsers.Add(newUser);
            _context.SaveChanges();

            return newUser.Id;
        }

        public void Delete(int id) {
            _context.MyUsers.Remove(_context.MyUsers.Find(id));
            _context.SaveChanges();
            System.Console.WriteLine(_context.MyUsers.Count());
        }

        public MyUser Get(int id) => _context.MyUsers.Find(id);

        public IEnumerable<MyUser> GetAll() => _context.MyUsers.AsEnumerable();

        public int Put(int id, MyUser item) {
            var savedInstance = _context.MyUsers.Find(id);

            // Updating instance...
            savedInstance.Name = item.Name;
            savedInstance.LastName = item.LastName;
            savedInstance.Address = item.Address;
            savedInstance.Description = item.Description;
            savedInstance.IsAdmin = item.IsAdmin;
            savedInstance.AdminType = item.AdminType;

            _context.SaveChanges();

            return id;
        }
    }
}