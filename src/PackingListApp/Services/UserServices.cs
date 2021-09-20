using System.Collections.Generic;
using System.Linq;
using PackingListApp.DTO;
using PackingListApp.EntityFramework;
using PackingListApp.Interfaces;
using PackingListApp.Models;

namespace PackingListApp.Services
{
    public class UserServices : IUserServices
    {

        #region Properties
        
        private readonly TestContext _context;
        
        #endregion
        
        #region Constructor

        public UserServices(TestContext context)
        {
            _context = context;
        }

        #endregion
        
        #region IUserServices Implementation

        public List<User> GetAll()
        {
            return _context.UserModels.ToList();
        }

        public int Add(UserDTO itemDto)
        {
            var instance = new User
            {
                FirstName = itemDto.FirstName,
                LastName = itemDto.LastName,
                Address = itemDto.Address,
                Description = itemDto.Description,
                IsAdmin = itemDto.IsAdmin,
                AdminType = itemDto.AdminType
            };

            _context.UserModels.Add(instance);
            _context.SaveChanges();

            return instance.Id;
        }

        public User Get(int id)
        {
            return _context.UserModels
                .FirstOrDefault(t => t.Id == id);
        }

        public int Put(int id, User userItem)
        {
            var item = _context.UserModels.FirstOrDefault(t => t.Id == userItem.Id);

            if (item is null) return 0;

            item.FirstName = userItem.FirstName;
            item.LastName = userItem.LastName;
            item.Address = userItem.Address;
            item.Description = userItem.Description;
            item.IsAdmin = userItem.IsAdmin;
            item.AdminType = userItem.AdminType;

            _context.SaveChanges();

            return item.Id;
        }

        public void Delete(int id)
        {
            var item = _context.UserModels.Find(id);

            if (item == null) return;

            _context.UserModels.Remove(item);
            _context.SaveChanges();
        }

        #endregion
    }
}