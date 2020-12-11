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

        public int Add(NewUserModel testmodel)
        {
            var newtest = new UserModel()
            {
                Name = testmodel.Name,
                LastName = testmodel.LastName,
                Description = testmodel.Description,
                IsAdmin = testmodel.IsAdmin,
                AdminType = testmodel.AdminType,
            };
            _context.UserModels.Add(newtest
            );
            _context.SaveChanges();
            return newtest.Id;
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
            itemput.Description = item.Description;
            itemput.Name = item.Name;
            itemput.LastName = item.LastName;
            itemput.IsAdmin = item.IsAdmin;
            itemput.AdminType = item.AdminType;
            _context.SaveChanges();
            return id;

        }
        public int Delete(int id)
        {
            var itemput = _context.UserModels.FirstOrDefault(t => t.Id == id);    
            _context.Remove(itemput);
            _context.SaveChanges();
            return id;

        }
    }
}
