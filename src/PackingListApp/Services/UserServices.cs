using PackingListApp.EntityFramework;
using PackingListApp.Interfaces;
using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Services
{
    public class UserServices : IUserServices
    {
        private readonly TestContext _context;
        public UserServices(TestContext context)
        {
            _context = context;
        }

        public int Add(NewUser user)
        {
            var newUser = new User()
            {
                Name = user.Name,
                LastNames = user.LastNames,
                Address = user.Address,
                IsAdmin = user.IsAdmin,
                AdminType = user.AdminType
            };
            _context.Users.Add(newUser);
            _context.SaveChanges();
            return newUser.Id;
        }

        public User Get(int id)
        {
            return _context.Users.FirstOrDefault(t => t.Id == id);
        }

        public List<User> GetAll()
        {
            return _context.Users.ToList();
        }

        public int Put(int id, User item)
        {
            var itemput = _context.Users.FirstOrDefault(t => t.Id == id);
            if (itemput != null)
            {
                itemput.Name = item.Name;
                itemput.LastNames = item.LastNames;
                itemput.Address = item.Address;
                itemput.IsAdmin = item.IsAdmin;
                itemput.AdminType = item.AdminType;
                _context.SaveChanges();
            }
            return id;
        }
    }
}

