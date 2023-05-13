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
        private readonly TestContext _context;
        public TestServices(TestContext context)
        {
            _context = context;
        }

        public int Add(NewTestModel testmodel)
        {
            var newtest = new Occupation()
            {
                Title = testmodel.Title,
                Description = testmodel.Description
            };
            _context.TestModels.Add(newtest
            );
            _context.SaveChanges();
            return newtest.Id;
        }

        public Occupation Get(int id)
        {
            return _context.TestModels.FirstOrDefault(t => t.Id == id);
        }

        public List<Occupation> GetAll()
        {
            return _context.TestModels.ToList();
        }

        public int Put(int id, Occupation item)
        {
            var itemput = _context.TestModels.FirstOrDefault(t => t.Id == id);
            itemput.Description = item.Description;
            itemput.Title = item.Title;
            _context.SaveChanges();
            return id;

        }

        public int Delete(int id)
        {
            var occup = _context.TestModels.FirstOrDefault(t => t.Id == id);
            _context.TestModels.Remove(occup);
            _context.SaveChanges();
            return id;
        }
    }
}
