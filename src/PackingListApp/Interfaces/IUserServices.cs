using PackingListApp.Models;
using PackingListApp.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace PackingListApp.Interfaces
{
    public interface IUserServices
    {
        List<UserModel> GetAll();

        int Add(NewUserModel userModel);

        UserModel Get(int id);
        int Put(int id, UserModel item);
        int Delete(int id);
    }
}
