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
        int Add(NewUser user);
        User Get(int id);
        int Put(int id, User item);
    }
}

