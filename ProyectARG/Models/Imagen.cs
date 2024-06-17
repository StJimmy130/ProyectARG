using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class Imagen
{

    [Key]
    public int ImagenID { get; set; }
    public byte []? ImagenByte { get; set; }
    public string? ContentType { get; set; }
    public string? NombreArchivo { get; set; }
    public int InmuebleID { get; set; }
    public int? UsuarioID { get; set; }
    public virtual Inmueble Inmuebles { get; set; }
}