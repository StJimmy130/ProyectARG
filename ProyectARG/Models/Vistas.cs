using System.ComponentModel.DataAnnotations;
using Microsoft.VisualBasic;

namespace ProyectARG.Models;

public class Vista
{
    [Key]
    public int VistaID { get; set; }
    public int? UsuarioID { get; set; }
    public int InmuebleID { get; set; }
    public DateTime VistaFecha { get; set; }
    public virtual Inmueble Inmuebles { get; set; }
    public virtual Usuario Usuarios { get; set; }

}