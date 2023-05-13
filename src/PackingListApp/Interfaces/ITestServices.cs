using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Interfaces
{
    public interface ITestServices
    {
        List<Occupation> GetAll();

        int Add(NewTestModel testmodel);

        Occupation Get(int id);
        int Put(int id, Occupation item);

        int Delete(int id);
    }
}
