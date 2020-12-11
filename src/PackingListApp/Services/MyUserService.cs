using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PackingListApp.EntityFramework;
using PackingListApp.Interfaces;
using PackingListApp.Models;
using PackingListApp.DTO;

namespace PackingListApp.Services {
    public class MyUserService : IMyUserService {

        private readonly PackingListAppContext _context;

        public MyUserService(PackingListAppContext context) {
            _context = context;
        }

        public int Add(NewMyUserModel usermodel) {
            (string name, string lastName, string address) = usermodel;
            
            // Saving instance...
            var newUser = new MyUser() {
                Name = name, LastName = lastName, Address = address
            };            
            _context.MyUsers.Add(newUser);
            _context.SaveChanges();

            return newUser.Id;
        }

        public MyUser Get(int id) => _context.MyUsers.Find(id);

        public IEnumerable<MyUser> GetAll() => _context.MyUsers.AsEnumerable();

        public int Put(int id, MyUser item) {
            var savedInstance = _context.MyUsers.Find(id);
            
            // Updating instance...
            savedInstance.Name = item.Name;
            savedInstance.LastName = item.LastName;
            savedInstance.Address = item.Address;
            _context.SaveChanges();

            return id;
        }
    }
}