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
                Name = usermodel.Name,
                LastName = usermodel.LastName,
                Direction = usermodel.Direction,
                IsAdmin = usermodel.IsAdmin,
                AdminType = usermodel.AdminType,

            };
            _context.UserModels.Add(newuser);
            _context.SaveChanges();
            return newuser.Id;
        }


        public UserModel Get(int id)
        {
            return _context.UserModels.FirstOrDefault(x => x.Id == id);
        }


        List<UserModel> IUserServices.GetAll()
        {
            return _context.UserModels.ToList();
        }


        public int Put(int id, UserModel item)
        {
            var itemput = _context.UserModels.FirstOrDefault(x => x.Id == id);
            itemput.Name = item.Name;
            itemput.LastName = item.LastName;
            itemput.Direction = item.Direction;
            itemput.IsAdmin = item.IsAdmin;
            itemput.AdminType = item.AdminType;
            _context.SaveChanges();
            return id;
        }

        public int Delete(int id)
        {
            var itemDelete = _context.UserModels.FirstOrDefault(x => x.Id == id);
            _context.Remove(itemDelete);
            _context.SaveChanges();
            return id;
        }

        
    }
}