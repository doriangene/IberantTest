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
        private readonly AppDbContext _context;
        public UserServices(AppDbContext context)
        {
            _context = context;
        }

        public int Add(NewUserModel usermodel)
        {
            var newUser = new UserModel()
            {
                FirstName = usermodel.FirstName,
                LastName = usermodel.LastName,
                Address = usermodel.Address
            };

            _context.UserModels.Add(newUser);
            _context.SaveChanges();
            return newUser.Id;
        }

        public UserModel Get(int id)
        {
            return _context.UserModels.FirstOrDefault(t => t.Id == id);
        }

        public List<UserModel> GetAll()
        {
            return _context.UserModels.ToList();
        }

        public int Put(int id, UserModel item)
        {
            var itemput = _context.UserModels.FirstOrDefault(t => t.Id == id);
            itemput.FirstName = item.FirstName;
            itemput.LastName = item.LastName;
            itemput.Address = item.Address;
            _context.SaveChanges();
            return id;

        }
    }
}
