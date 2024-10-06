using System.ComponentModel.DataAnnotations;
using ProyectARG.Models;

public class Favorito
{
    [Key]
    public int InmuebleFavoritoID { get; set; }
    public int UsuarioID { get; set; }  // Relación con el Usuario
    public int InmuebleID { get; set; } // Relación con el Inmueble
    public DateTime FechaAgregado { get; set; } = DateTime.Now; // Opcional: fecha cuando se agregó a favoritos

    public virtual Usuario Usuario { get; set; } // Relación con Usuario
    public virtual Inmueble Inmueble { get; set; } // Relación con Inmueble
}
