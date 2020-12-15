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

        public UserServices(TestContext testContext)
        {
            _context = testContext;
        }

        public int Add(NewUserModel usermodel)
        {
            var newuser = new UserModel()
            {
                Name = usermodel.Name,
                Lastname = usermodel.Lastname,
                Address = usermodel.Address
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
            itemput.Name = item.Name;
            itemput.Lastname = item.Lastname;
            itemput.Address = item.Address;
            _context.SaveChanges();
            return id;
        }

        public int Delete(int id)
        {
            var itemdelete = new UserModel { Id = id };
            _context.UserModels.Attach(itemdelete);
            _context.UserModels.Remove(itemdelete);
            _context.SaveChanges();
            return id;
        }
    }
}
