using Microsoft.EntityFrameworkCore;
using PackingListApp.DTO;
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

        public int Add(NewUserModel userModel)
        {
            var newUser = new UserModel()
            {
                Name = userModel.Name,
                LastName = userModel.LastName,
                Address = userModel.Address,
                IsAdmin = userModel.IsAdmin,
                AdminType = userModel.IsAdmin ? userModel.AdminType : 0,
                OccupationModelId = userModel.OccupationModelId,
            };
            _context.UserModels.Add(newUser
            );
            _context.SaveChanges();
            return newUser.Id;
        }

        public UserModel Get(int id)
        {
            return _context.UserModels.FirstOrDefault(t => t.Id == id);
        }

        public List<UserModel> GetAll()
        {
            return _context.UserModels.Include(x => x.Occupation).ToList();
        }

        public int Put(int id, UserModel item)
        {
            var itemput = _context.UserModels.FirstOrDefault(t => t.Id == id);
            itemput.Name = item.Name;
            itemput.LastName = item.LastName;
            itemput.Address = item.Address;
            itemput.IsAdmin = item.IsAdmin;
            itemput.AdminType = item.IsAdmin ? item.AdminType : 0;
            itemput.OccupationModelId = item.OccupationModelId;
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
