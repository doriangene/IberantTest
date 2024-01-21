using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Interfaces
{
    public interface IUserServices
    {
        List<UserModel> GetAll();
        int Add(NewUserModel usermodel);
        UserModel Get(int id);
        int Put(int id, UserModel item);
        int Delete(int id);
    }
}
