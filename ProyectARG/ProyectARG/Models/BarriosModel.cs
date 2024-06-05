using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class BarriosModel
{
    [Key]
    public int BarriosId { get; set; }
    public int LocalidadId { get; set; }
    public string? Nombre { get; set; }
    
}
