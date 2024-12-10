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
    public class OccupationServices : IOccupationServices
    {
        private readonly ApplicationContext _context;
        public OccupationServices(ApplicationContext context)
        {
            _context = context;
        }

        public int Add(NewOccupation occupation)
        {
            var newOccupation = new Occupation()
            {
                Title = occupation.Title,
                Description = occupation.Description
            };
            _context.Occupations.Add(newOccupation
            );
            _context.SaveChanges();
            return newOccupation.Id;
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

        public int Delete(int id)
        {
            Occupation occupation = _context.Occupations.FirstOrDefault(t => t.Id == id);
            _context.Occupations.Remove(occupation);
            _context.SaveChanges();
            return occupation.Id;
        }
    }
}
