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

        int Add(NewOccupation occupation);

        Occupation Get(int id);
        int Put(int id, Occupation item);

        int Delete(int id);
    }
}
