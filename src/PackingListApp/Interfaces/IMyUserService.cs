using PackingListApp.Models;
using System.Collections.Generic;

namespace PackingListApp.Interfaces {
    public interface IMyUserService {
        // Returns all MyUser instances currently in the table
        IEnumerable<MyUser> GetAll();

        // Creates a new MyUser using the fields of a NewMyUserModel object
        int Add(NewMyUser usermodel);

        // Retrieves the MyUser instance with Id=id from the table
        MyUser Get(int id);

        // Updates the instance currently with Id=id, with the
        // using the fields of the instance specified in item
        //TODO shouldn't item be a request instead of an instance?
        int Put(int id, MyUser item);

        // Deletes an instance
        void Delete(int id);
    }
}