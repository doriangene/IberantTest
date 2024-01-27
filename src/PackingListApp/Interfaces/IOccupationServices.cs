using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Interfaces
{
    public interface IOccupationServices
    {
        List<Occupation> GetAll();
        int Add(NewOccupation testmodel);
        Occupation Get(int id);
        int Put(int id, Occupation item);
        void Delete(int id);
    }
}
