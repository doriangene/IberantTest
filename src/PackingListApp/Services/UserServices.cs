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

        public int Add(NewUserModel model)
        {
            var newUser = new UserModel()
            {
                Name = model.Name,
                Lastname = model.Lastname,
                Address = model.Address,
            };
            _context.Users.Add(newUser
            );
            _context.SaveChanges();
            return newUser.Id;
        }

        public UserModel Get(int id)
        {
            return _context.Users.FirstOrDefault(t => t.Id == id);
        }

        public List<UserModel> GetAll()
        {
            return _context.Users.ToList();
        }

        public int Put(int id, UserModel item)
        {
            var itemput = _context.Users.FirstOrDefault(t => t.Id == id);
            itemput.Name = item.Name;
            itemput.Lastname = item.Lastname;
            itemput.Address = item.Address;
            _context.SaveChanges();
            return id;

        }
    }
}
