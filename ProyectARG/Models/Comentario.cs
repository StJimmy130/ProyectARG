using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class Comentario
{
    [Key]
    public int ComentarioID { get; set; }
    public string Mensaje { get; set; }
    public int? UsuarioID { get; set; }
    public int? InmuebleID { get; set; }
    
    public virtual Inmueble Inmuebles { get; set; }
    public virtual Usuario Usuarios { get; set; }

}

public class VistaComentario
{
    public int ComentarioID { get; set; }
    public string NombreUsuario { get; set; }
    public string Mensaje { get; set; }
    
    
}
