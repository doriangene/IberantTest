using PackingListApp.DTO;
using PackingListApp.Models;
using System.Collections.Generic;

namespace PackingListApp.Interfaces
{
    public interface IUsuarioServices
    {

        List<UsuarioModel> GetAll();

        int Add(DTOUsuario usuariomodel);

        UsuarioModel Get(int id);
        int Put(int id, UsuarioModel item);
    }
}
