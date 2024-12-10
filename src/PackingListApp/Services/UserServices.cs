using PackingListApp.EntityFramework;
using PackingListApp.Interfaces;
using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApplicationContext = PackingListApp.EntityFramework.ApplicationContext;

namespace PackingListApp.Services
{
    public class UserServices : IUserServices
    {
        private readonly ApplicationContext _context;
        public UserServices(ApplicationContext context)
        {
            _context = context;
        }

        public async Task<int> Add(UserAddInput usermodel)
        {

            var newUser = new User()
            {
                Name = usermodel.Name,
                LastName = usermodel.LastName,
                Address = usermodel.Address,
                IsAdmin = usermodel.IsAdmin,
                OccupationId = usermodel.OccupationId,
                AdminType = (AdminType)usermodel.AdminType
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser.Id;
        }


        public Task<User> Get(int id)
        {
            return Task.FromResult(_context.Users.FirstOrDefault(t => t.Id == id));
        }

        public async Task<List<User>> GetAll()
        {
            return await Task.FromResult(_context.Users.ToList());
        }


        public async Task<int> Put(int id, UserUpdateInput item)
        {
            var userPatch = _context.Users.FirstOrDefault(t => t.Id == id);

            foreach (var field in typeof(UserUpdateInput).GetProperties())
            {
                var propValue = field.GetValue(item);

                if(field.Name == "AdminType" && !item.IsAdmin)
                    propValue = 0;

                var existingField =typeof(User).GetProperty(field.Name);
                if (existingField != null && existingField.CanWrite)
                    existingField.SetValue(userPatch, propValue, null);
            }
            await _context.SaveChangesAsync();
            return id;

        }

        public async Task<int> Delete(int id)
        {
            User user = _context.Users.FirstOrDefault(t => t.Id == id);
            await Task.FromResult(_context.Users.Remove(user));
            await _context.SaveChangesAsync();
            return user.Id;
        }
    }
}
