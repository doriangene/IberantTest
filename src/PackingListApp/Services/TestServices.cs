using PackingListApp.EntityFramework;
using PackingListApp.Interfaces;
using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Services
{
    public class TestServices : ITestServices
    {
        private readonly DataContext _context;
        public TestServices(DataContext context)
        {
            _context = context;
        }

        public int Add(NewOccupation testmodel)
        {
            var newtest = new Occupation()
            {
                Title = testmodel.Title,
                Description = testmodel.Description
            };
            _context.Occupations.Add(newtest
            );
            _context.SaveChanges();
            return newtest.Id;
        }

        public Occupation Get(int id)
        {
            return _context.Occupations.FirstOrDefault(t => t.Id == id);
        }

        public List<Occupation> GetAll()
        {
            return _context.Occupations.ToList();
        }

        public int Put(int id, Occupation item)
        {
            var itemput = _context.Occupations.FirstOrDefault(t => t.Id == id);
            itemput.Description = item.Description;
            itemput.Title = item.Title;
            _context.SaveChanges();
            return id;

        }
    }
}
