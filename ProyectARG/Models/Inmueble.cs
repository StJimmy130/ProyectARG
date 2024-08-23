using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class Inmueble
{
    [Key]
    public int InmuebleID { get; set; }
    public int LocalidadID { get; set; }
    public string? Barrio { get; set; }
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
    public int? Piso { get; set; }
    public string? NroDepartamento { get; set; }
    public int? UsuarioID { get; set; }
    public bool Activo { get; set; }
    public DateTime FechaAlta { get; set; }
    public virtual Usuario? Usuario { get; set; }

    public virtual ICollection<Imagen>? Imagenes { get; set; }

    public virtual ICollection<Valoracion>? Valoraciones { get; set; }

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
    Cabaña,
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
    public string? TituloString { get; set; } 
    public string? LocalidadString { get; set; } 
    public string? DireccionString { get; set; } 
    public int NroDireccionString { get; set; } 
    public float PrecioString { get; set; } 
    public string? ProvinciaString { get; set; } 
    public string? TipoOperacionString { get; set; } 
    public string? TipoInmuebleString { get; set;} 
    public string? BarrioString { get; set; } 
    public string? SuperficieTotalString { get; set; } 
    public string? SuperficieCubiertaString { get; set; } 
    public string? AmobladoString { get; set; } 
    public string? DormitoriosString { get; set; } 
    public string? BaniosString { get; set; } 
    public string? CantidadAmbientesString { get; set; } 
    public string? CocheraString { get; set; } 
    public string? DescripcionString { get; set; }
    public string? PisoString { get; set; }
    public string? NroDepartamentoString { get; set; }
    public string? ImagenSrc { get; set; } // Propiedad para una sola imagen
    public List<ImagenVista>? Imagenes { get; set; } 

}

public class ImagenVista
{
    public int ImagenID { get; set; }
    public string? ImagenSrc { get; set; }
}
