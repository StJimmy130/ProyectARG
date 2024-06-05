using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class ImagenesModel
{

    [Key]
    public int ImagenId { get; set; }
    public byte []? Imagen { get; set; }
    public string? ContentType { get; set; }
    public string? NombreArchivo { get; set; }

}