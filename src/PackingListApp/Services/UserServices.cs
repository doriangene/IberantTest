using PackingListApp.DTO;
using PackingListApp.EntityFramework;
using PackingListApp.Interfaces;
using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
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
        public int Add(NewUserModel userModel)
        {
            var newUser = new UserModel()
            {
                Name = userModel.Name,
                LastNames = userModel.LastNames,
                Address = userModel.Address,
                Description = userModel.Description,
                IsAdmin = userModel.IsAdmin,
                AdminType = userModel.AdminType
            };
            _context.UserModels.Add(newUser);
            _context.SaveChanges();
            return newUser.Id;
        }

        public int Delete(int id)
        {
            UserModel user = _context.UserModels.FirstOrDefault(x => x.Id == id);
            _context.UserModels.Remove(user);
            _context.SaveChanges();

            return id;
        }

        public UserModel Get(int id)
        {
            return _context.UserModels.FirstOrDefault(x => x.Id == id);
        }

        public List<UserModel> GetAll()
        {
            return _context.UserModels.ToList();
        }

        public int Put(int id, UserModel item)
        {
            var itemput = _context.UserModels.FirstOrDefault(x => x.Id == id);
            itemput.Name = item.Name;
            itemput.LastNames = item.LastNames;
            itemput.Address = item.Address;
            itemput.Description = item.Description;
            itemput.IsAdmin = item.IsAdmin;
            itemput.AdminType = item.AdminType;

            _context.SaveChanges();

            return id;
        }
    }
}
