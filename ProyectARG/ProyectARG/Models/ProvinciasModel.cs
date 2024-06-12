using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class ProvinciasModel
{
    [Key]
    public int ProvinciaID { get; set; }
    public string Nombre { get; set; }
    public virtual ICollection<LocalidadesModel> Localidades { get; set; }
}

public enum Provincia
{
    BuenosAires =1,
    CiudadAutónomaDeBuenosAires,
    Catamarca,
    Chaco,
    Chubut,
    Córdoba,
    Corrientes,
    EntreRíos,
    Formosa,
    Jujuy,
    LaPampa,
    LaRioja,
    Mendoza,
    Misiones,
    Neuquen,
    RioNegro,
    Salta,
    SanJuan,
    SanLuis,
    SantaCruz,
    SantaFe,
    SantiagoDelEstero,
    TierradelFuego,
    Tucumán,
}