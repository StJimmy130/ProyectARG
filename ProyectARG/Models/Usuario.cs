using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class Usuario
{
    [Key]
    public int? UsuarioID { get; set; }
    public string? Instagram { get; set; }
    public string? Facebook { get; set; }
    public int LocalidadID { get; set; }
    public virtual Localidad Localidad { get; set; }
    public virtual ICollection<Inmueble> Inmuebles { get; set; }
    public virtual ICollection<Imagen> Imagenes { get; set; }
    public virtual ICollection<Valoracion> Valoraciones { get; set; }

}
