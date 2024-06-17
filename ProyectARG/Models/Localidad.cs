using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class Localidad
{
    [Key]
    public int LocalidadID { get; set; }
    public string Nombre { get; set; }
    public int ProvinciaID { get; set; }
    public virtual Provincia Provincia { get; set; }

    public virtual ICollection<Inmueble> Inmuebles { get; set; }
    public virtual ICollection<Usuario> Usuarios { get; set; }



}