using PackingListApp.DTO;
using PackingListApp.EntityFramework;
using PackingListApp.Interfaces;
using PackingListApp.Models;
using System.Collections.Generic;
using System.Linq;

namespace PackingListApp.Services
{
    public class UsuarioServices : IUsuarioServices
    {
        private readonly TestContext _context;

        public UsuarioServices(TestContext context)
        {
            _context = context;
        }


        public int Add(DTOUsuario usuariomodel)
        {
            var newuser = new UsuarioModel()
            {
                Nombre = usuariomodel.Nombre,
                Apellidos = usuariomodel.Apellidos,
                Direccion = usuariomodel.Direccion                
            };
            _context.UsuarioModels.Add(newuser);
            _context.SaveChanges();
            return newuser.Id;
        }

        public UsuarioModel Get(int id)
        {
            return _context.UsuarioModels.FirstOrDefault(t => t.Id == id);
        }

        public List<UsuarioModel> GetAll()
        {
            return _context.UsuarioModels.ToList();
        }

        public int Put(int id, UsuarioModel item)
        {
            var itemput = _context.UsuarioModels.FirstOrDefault(t => t.Id == id);
            itemput.Nombre = item.Nombre;
            itemput.Apellidos = item.Apellidos;
            itemput.Direccion = item.Direccion;
            _context.SaveChanges();
            return id;
        }
    }
}
