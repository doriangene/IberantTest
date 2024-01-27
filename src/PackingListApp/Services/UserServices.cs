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
        private readonly DataContext _context;
        public UserServices(DataContext context)
        {
            _context = context;
        }
        public int Add(NewUser testmodel)
        {
            Occupation occupation = testmodel.OccupationId != null ? _context.Occupations
                .FirstOrDefault(t => t.Id == testmodel.OccupationId) : null;
            var newtest = new User()
            {
                Name = testmodel.Name,
                LastName = testmodel.LastName,
                Address = testmodel.Address,
                IsAdmin = testmodel.IsAdmin,
                AdminType = testmodel.AdminType,
                OccupationId = testmodel.OccupationId,
                Occupation = occupation
            };
            _context.Users.Add(newtest);
            _context.SaveChanges();
            return newtest.Id;
        }

        public User Get(int id)
        {
            return _context.Users.FirstOrDefault(t => t.Id == id);
        }

        public List<User> GetAll()
        {
            return _context.Users.ToList();
        }

        public int Put(int id, User item)
        {
            var itemput = _context.Users.FirstOrDefault(t => t.Id == id);
            Occupation occupation = item.OccupationId != null ? _context.Occupations
                .FirstOrDefault(t => t.Id == item.OccupationId) : null;
            itemput.Name = item.Name;
            itemput.LastName = item.LastName;
            itemput.Address = item.Address;
            itemput.IsAdmin = item.IsAdmin;
            itemput.AdminType = item.AdminType;
            itemput.OccupationId = item.OccupationId;
            itemput.Occupation = occupation;
            _context.SaveChanges();
            return id;
        }

        public void Delete(int id)
        {
            var itemput = _context.Users.FirstOrDefault(t => t.Id == id);
            _context.Users.Remove(itemput);
            _context.SaveChanges();
        }
    }
}
