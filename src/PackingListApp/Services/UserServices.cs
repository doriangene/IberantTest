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

        public int Add(NewUserModel usermodel)
        {
            var newuser = new UserModel()
            {
                FirstName = usermodel.FirstName,
                LastName = usermodel.LastName,
                Address = usermodel.Address,
                IsAdmin = usermodel.IsAdmin,
                AdminType = usermodel.AdminType,
                OccupationId = usermodel.OccupationId,
                Occupation = usermodel.Occupation
            };
            _context.UserModels.Add(newuser
            );
            _context.SaveChanges();
            return newuser.Id;
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
            itemput.IsAdmin = item.IsAdmin;
            itemput.AdminType = item.AdminType;
            itemput.OccupationId = item.OccupationId;
            itemput.Occupation = item.Occupation;

            _context.SaveChanges();
            return id;

        }

        public bool Delete(int id)
        {
            var user = _context.UserModels.Find(id);
            if (user == null)
            {
                return false;
            }

            _context.UserModels.Remove(user);
            _context.SaveChanges();

            return true;
        }
    }
}
