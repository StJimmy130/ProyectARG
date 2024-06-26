using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class Inmueble
{
    [Key]
    public int InmuebleID { get; set; }
    public int LocalidadID { get; set; }
    public string Barrio { get; set; }
    public string? Titulo { get; set; }
    public float? Precio { get; set; }
    public int? SuperficieTotal { get; set; }
    public int? SuperficieCubierta { get; set; }
    public Operacion TipoOperacion { get; set; }
    public TipoInmueble TipoInmueble { get; set; }
    public bool Amoblado { get; set; }
    public int Dormitorios { get; set; }
    public int Banios { get; set; }
    public int CantidadAmbientes { get; set; }
    public bool Cochera { get; set; }
    public string? Direccion { get; set; }
    public int NroDireccion { get; set; }
    public string? Descripcion { get; set; }
    public int? UsuarioID { get; set; }

    public virtual Usuario Usuario { get; set; }

    public virtual ICollection<Imagen> Imagenes { get; set; }

    public virtual ICollection<Valoracion> Valoraciones { get; set; }

}

public enum Operacion 
{
    Alquiler = 1,
    Venta,
    AlquilerTemporal,
}

public enum TipoInmueble
{
    Campo = 1,
    Casa,
    Cochera,
    Departamento,
    Deposito,
    Galpon,
    FondoDeComercio,
    Local,
    Oficina,
    OtroInmueble,
    Quinta,
    TerrenoYLote,
}

public class VistaInmueble
{
    public int InmuebleID { get; set; }
    public string TituloString { get; set; }
    public string LoacalidadString { get; set; }
    public string Direccion { get; set; }
    public int NroDireccion { get; set; }
    public float Precio { get; set; }
    public string ProvinciaString { get; set; }
    public string TipoOperacionString { get; set; }
}
