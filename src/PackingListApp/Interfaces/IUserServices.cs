using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Interfaces
{
    public interface IUserServices
    {
        Task<List<User>> GetAll();

        Task<int> Add(UserAddInput usermodel);

        Task<User> Get(int id);
        
        Task<int> Delete(int id);

        Task<int> Put(int id, UserUpdateInput user);
    }
}
