using PackingListApp.EntityFramework;
using PackingListApp.Interfaces;
using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Services
{
    public class OccupationServices : IOccupationServices
    {
        private readonly TestContext _context;
        public OccupationServices(TestContext context)
        {
            _context = context;
        }

        public int Add(NewOccupationModel occupationmodel)
        {
            var newoccupation= new OccupationModel()
            {
                Title = occupationmodel.Title,
                Description = occupationmodel.Description
            };
            _context.OccupationModels.Add(newoccupation
            );
            _context.SaveChanges();
            return newoccupation.Id;
        }

        public OccupationModel Get(int id)
        {
            return _context.OccupationModels.FirstOrDefault(t => t.Id == id);
        }

        public List<OccupationModel> GetAll()
        {
            return _context.OccupationModels.ToList();
        }

        public int Put(int id, OccupationModel item)
        {
            var itemput = _context.OccupationModels.FirstOrDefault(t => t.Id == id);
            itemput.Description = item.Description;
            itemput.Title = item.Title;
            _context.SaveChanges();
            return id;

        }
    }
}
