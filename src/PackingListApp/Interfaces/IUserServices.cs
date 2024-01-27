using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Interfaces
{
    public interface IUserServices
    {
        List<User> GetAll();
        int Add(NewUser testmodel);
        User Get(int id);
        int Put(int id, User item);
        void Delete(int id);
    }
}
