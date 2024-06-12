using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class LocalidadesModel
{
    [Key]
    public int LocalidadId { get; set; }
    public string Nombre { get; set; }
    public int ProvinciaID { get; set; }

    public virtual ProvinciasModel Provincia { get; set; }

    public virtual ICollection<InmuebleModel> Inmuebles { get; set; }
    public virtual ICollection<UsuariosModel> Usuarios { get; set; }



}