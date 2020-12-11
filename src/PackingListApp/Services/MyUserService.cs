using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PackingListApp.EntityFramework;
using PackingListApp.Interfaces;
using PackingListApp.Models;
using PackingListApp.DTO;

namespace PackingListApp.Services {
    public class MyUserService : IMyUserService {

        private readonly PackingListAppContext _context;

        public MyUserService(PackingListAppContext context) {
            _context = context;
        }

        public int Add(NewMyUserModel usermodel) {
            throw new NotImplementedException();
        }

        public MyUser Get(int id) {
            throw new NotImplementedException();
        }

        public IEnumerable<MyUser> GetAll() {
            throw new NotImplementedException();
        }

        public int Put(int id, MyUser item) {
            throw new NotImplementedException();
        }
    }
}