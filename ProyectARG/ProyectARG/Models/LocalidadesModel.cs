using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class LocalidadesModel
{
    [Key]
    public int LocalidadId { get; set; }
    public string Nombre { get; set; }
    public int ProvinciaId { get; set; }


}