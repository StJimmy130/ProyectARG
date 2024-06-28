using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class Localidad
{
    [Key]
    public int LocalidadID { get; set; }
    public string Nombre { get; set; }
    public int ProvinciaID { get; set; }
    public virtual Provincia Provincias { get; set; }

    public virtual ICollection<Inmueble> Inmuebles { get; set; }
    public virtual ICollection<Usuario> Usuarios { get; set; }

}


public class VistaLocalidad
{
    public int LocalidadID { get; set; }
    public string LocalidadNombre { get; set; }
    public int ProvinciaID { get; set; }
    public string ProvinciaNombre { get; set; }
}