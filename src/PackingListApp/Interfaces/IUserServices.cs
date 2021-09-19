using System.Collections.Generic;
using PackingListApp.DTO;
using PackingListApp.Models;

namespace PackingListApp.Interfaces
{
    public interface IUserServices
    {
        List<User> GetAll();

        int Add(UserDTO itemDto);

        User Get(int id);

        int Put(int id, User itemInstance);

        void Delete(int id);
    }
}
