using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Interfaces
{
    public interface IOccupationServices
    {
        List<OccupationModel> GetAll();
        int Add(NewOccupationModel testmodel);
        OccupationModel Get(int id);
        int Put(int id, OccupationModel item);
        int Delete(int id);
    }
}
