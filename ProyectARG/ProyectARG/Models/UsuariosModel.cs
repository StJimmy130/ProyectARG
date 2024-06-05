using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class UsuariosModel
{
    [Key]
    public int UsuarioId { get; set; }
    public string NombreCompleto { get; set; }
    public string Email { get; set; }
    public string Contraseña { get; set; }
    public int Contacto { get; set; }
    public int InmuebleId { get; set; }
    public bool TipoUsuario { get; set; }
    public int LocalidadId { get; set; }
    public string? Instagram { get; set; }
    public string? Facebook { get; set; }
    public string? X { get; set; }

}
