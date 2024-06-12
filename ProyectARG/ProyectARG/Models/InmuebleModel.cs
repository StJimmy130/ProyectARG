using System.ComponentModel.DataAnnotations;

namespace ProyectARG.Models;

public class InmuebleModel
{
    [Key]
    public int InmuebleId { get; set; }
    public int LocalidadId { get; set; }
    public string Barrio { get; set; }
    public string? Titulo { get; set; }
    public decimal? Precio { get; set; }
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
    public int UsuarioId { get; set; }

    public virtual UsuariosModel Usuario { get; set; }

    public virtual ICollection<ImagenesModel> Imagenes { get; set; }

    public virtual ICollection<ValoracionModel> Valoraciones { get; set; }

}

public enum Operacion 
{
    Alquiler,
    Venta,
    AlquilerTemporal,
}

public enum TipoInmueble
{
    Campo,
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

