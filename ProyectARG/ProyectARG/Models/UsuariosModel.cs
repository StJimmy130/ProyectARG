using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class UsuariosModel
{
    [Key]
    public string UsuarioId { get; set; }
    public string? Instagram { get; set; }
    public string? Facebook { get; set; }
    public virtual LocalidadesModel Localidad { get; set; }
    public virtual ICollection<ImagenesModel> Imagenes { get; set; }
    public virtual ICollection<ValoracionModel> Valoraciones { get; set; }

}
