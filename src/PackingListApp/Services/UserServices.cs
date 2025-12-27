using PackingListApp.EntityFramework;
using PackingListApp.Interfaces;
using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

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
                Name = usermodel.Name,
                LastName = usermodel.LastName,
                Address = usermodel.Address,
                isAdmin = usermodel.isAdmin,
                Category = usermodel.isAdmin ? usermodel.Category : 0,
                OccupationId = usermodel.OccupationId,
            };
            _context.UserModels.Add(newuser);
            _context.SaveChanges();
            return newuser.Id;
        }

        public UserModel Get(int id)
        {
            return _context.UserModels.Include(u => u.Occupation).FirstOrDefault(t => t.Id == id);
        }

        public List<UserModel> GetAll()
        {
            return _context.UserModels.Include(u => u.Occupation).ToList();
        }

        public int Put(int id, UserModel item)
        {
            var itemput = _context.UserModels.FirstOrDefault(t => t.Id == id);
            itemput.Name = item.Name;
            itemput.LastName = item.LastName;
            itemput.Address = item.Address;
            itemput.isAdmin = item.isAdmin;
            itemput.Category = item.isAdmin ? item.Category : 0;
            itemput.OccupationId = item.OccupationId;
            _context.SaveChanges();
            return id;

        }

        public void Delete(int id)
        {
            var user = _context.UserModels.FirstOrDefault(t => t.Id == id);
            if (user != null)
            {
                _context.UserModels.Remove(user);
                _context.SaveChanges();
            }
        }
    }
}
