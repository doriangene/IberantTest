using System.ComponentModel.DataAnnotations;

namespace PackingListApp.Models
{
    public class UsuarioModel
    {
        [Key]
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        [MaxLength(33)]
        public string Direccion { get; set; }
    }
}
