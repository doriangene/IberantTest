using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Interfaces
{
    public interface ITestServices
    {
        List<TestModel> GetAll();

        int Add(NewTestModel testmodel);

        TestModel Get(int id);
        int Put(int id, TestModel item);
    }
}
