using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace PackingListApp.Models
{
    public class UsuarioModel
    {
        [Key]
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        [Column(TypeName = "nvarchar(10)")]
        public string Direccion { get; set; }
    }
}
