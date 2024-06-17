using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class Valoracion
{
    [Key]
    public int ValoracionID { get; set; }
    [Range(0,10)]
    public int Puntuacion { get; set; }
    public string? Comentario { get; set; }
    public int? UsuarioID { get; set; }
    public int? InmuebleID { get; set; }
    
    public virtual Inmueble Inmuebles { get; set; }

}
