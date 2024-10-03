using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class Usuario
{
    [Key]
    public int? UsuarioID { get; set; }
    public string? Nombre { get; set; }
    public string? NroTelefono { get; set; }
    public string? Instagram { get; set; }
    public string? Facebook { get; set; }
    public String? Whatsapp { get; set; }
    public int? LocalidadID { get; set; }
    public string? CuentaID { get; set; }
    public virtual Localidad Localidad { get; set; }
    public virtual ICollection<Inmueble> Inmuebles { get; set; }
    public virtual ICollection<Valoracion> Valoraciones { get; set; }
    public virtual ICollection<Comentario> Comentarios { get; set; }
}
public class DatosUsuario{
    public string? Nombre { get; set; }
    public string? NroTelefono { get; set; }
    public string? Instagram { get; set; }
    public string? Facebook { get; set; }
    public String? Whatsapp { get; set; }
}
public class VistaUsuarios{
    public string? UsuarioID { get; set; }
    public string? Email { get; set; }
    public string? RolNombre { get; set; }
}

