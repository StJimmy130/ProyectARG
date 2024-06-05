using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class ValoracionModel
{
    [Key]
    public int ValoracionId { get; set; }
    [Range(0,10)]
    public int Puntuacion { get; set; }
    public string? Comentario { get; set; }
}
