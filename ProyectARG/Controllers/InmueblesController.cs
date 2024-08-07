using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectARG.Models;
using ProyectARG.Data;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ProyectARG.Controllers;
// [Authorize]
public class InmueblesController : Controller
{
    private ApplicationDbContext _context;

    public InmueblesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        var selectListItemsOperacion = new List<SelectListItem>
    {
        new SelectListItem { Value = "0", Text = "[SELECCIONE...]" }
    };

        var enumValuesOperacion = Enum.GetValues(typeof(Operacion)).Cast<Operacion>();

        foreach (var value in enumValuesOperacion)
        {
            selectListItemsOperacion.Add(new SelectListItem
            {
                Value = ((int)value).ToString(),
                Text = SplitCamelCase(value.ToString())
            });
        }

        var selectListItemsTipoInmueble = new List<SelectListItem>
    {
        new SelectListItem { Value = "0", Text = "[SELECCIONE...]" }
    };

        var enumValuesTipoInmueble = Enum.GetValues(typeof(TipoInmueble)).Cast<TipoInmueble>();

        foreach (var value in enumValuesTipoInmueble)
        {
            selectListItemsTipoInmueble.Add(new SelectListItem
            {
                Value = ((int)value).ToString(),
                Text = SplitCamelCase(value.ToString())
            });
        }

        var provincias = _context.Provincias.ToList();
        var localidades = _context.Localidades.ToList();

        provincias.Add(new Provincia { ProvinciaID = 0, Nombre = "[SELECCIONE...]" });
        ViewBag.ProvinciaID = new SelectList(provincias.OrderBy(c => c.Nombre), "ProvinciaID", "Nombre");

        localidades.Add(new Localidad { LocalidadID = 0, Nombre = "[SELECCIONE...]" });
        ViewBag.LocalidadID = new SelectList(localidades.OrderBy(c => c.Nombre), "LocalidadID", "Nombre");

        ViewBag.Operaciones = selectListItemsOperacion;
        ViewBag.TiposInmueble = selectListItemsTipoInmueble;

        return View();
    }

    private string SplitCamelCase(string input)
    {
        return System.Text.RegularExpressions.Regex.Replace(input, "(\\B[A-Z])", " $1");
    }

    public JsonResult GetLocalidadesByProvincia(int provinciaID)
{
    var localidades = _context.Localidades
                              .Where(l => l.ProvinciaID == provinciaID)
                              .OrderBy(l => l.Nombre)
                              .ToList();

    return Json(localidades);
}

 public JsonResult GetDetallePublicacion(int InmuebleID, int? localidadID)
{
    List<VistaInmueble> inmuebleDetalleMostrar = new List<VistaInmueble>();

    var Inmuebles = _context.Inmuebles.ToList();
    var Imagenes = _context.Imagenes.ToList(); // Traer todas las imágenes

    if (localidadID != 0)
    {
        Inmuebles = Inmuebles.Where(t => t.LocalidadID == localidadID).ToList();
    }

    if (InmuebleID != 0)
    {
        Inmuebles = _context.Inmuebles.Where(t => t.InmuebleID == InmuebleID).ToList();
    }

    var Provincias = _context.Provincias.ToList();
    var Localidades = _context.Localidades.ToList();

    foreach (var Inmueble in Inmuebles)
    {
        var localidad = Localidades.Where(t => t.LocalidadID == Inmueble.LocalidadID).SingleOrDefault();
        var provincia = Provincias.Where(t => t.ProvinciaID == localidad.ProvinciaID).SingleOrDefault();

        var imagenesInmueble = Imagenes.Where(img => img.InmuebleID == Inmueble.InmuebleID).ToList();
        var imagenesBase64 = imagenesInmueble.Select(imagen => new ImagenVista
        {
            ImagenID = imagen.ImagenID,
            ImagenSrc = $"data:{imagen.ContentType};base64,{Convert.ToBase64String(imagen.ImagenByte)}"
        }).ToList();

        var vistaInmueble = new VistaInmueble
        {
            InmuebleID = Inmueble.InmuebleID,
            TituloString = Inmueble.Titulo,
            ProvinciaString = provincia.Nombre,
            LocalidadString = localidad.Nombre,
            BarrioString = Inmueble.Barrio,
            DireccionString = Inmueble.Direccion,
            NroDireccionString = Inmueble.NroDireccion,
            SuperficieTotalString = Inmueble.SuperficieTotal.ToString(),
            SuperficieCubiertaString = Inmueble.SuperficieCubierta.ToString(),
            AmobladoString = Inmueble.Amoblado.ToString(),
            DormitoriosString = Inmueble.Dormitorios.ToString(),
            BaniosString = Inmueble.Banios.ToString(),
            CantidadAmbientesString = Inmueble.CantidadAmbientes.ToString(),
            CocheraString = Inmueble.Cochera.ToString(),
            DescripcionString = Inmueble.Descripcion,
            PrecioString = (float)Inmueble.Precio,
            TipoOperacionString = Inmueble.TipoOperacion.ToString(),
            TipoInmuebleString = Inmueble.TipoInmueble.ToString(),
            Imagenes = imagenesBase64 // Usar la lista de ImagenVista
        };
        inmuebleDetalleMostrar.Add(vistaInmueble);
    }

    return Json(inmuebleDetalleMostrar);
}



    public JsonResult GuardarPublicacion(int InmuebleID, int LocalidadID, string? Barrio, string? Titulo,
            float? Precio, int? SuperficieTotal, int? SuperficieCubierta, Operacion TipoOperacion,
            TipoInmueble TipoInmueble, bool Amoblado, int Dormitorios, int Banios, int CantidadAmbientes,
            bool Cochera, string? Direccion, int NroDireccion, string? Descripcion, int? UsuarioID,
            List<IFormFile> Imagenes)
    {
        string resultado = "";

        if (InmuebleID != null)
        {
            Inmueble inmueble = InmuebleID == 0 ? new Inmueble() : _context.Inmuebles.SingleOrDefault(t => t.InmuebleID == InmuebleID);

            if (inmueble != null)
            {
                inmueble.LocalidadID = LocalidadID;
                inmueble.Barrio = Barrio;
                inmueble.Titulo = Titulo;
                inmueble.Precio = Precio;
                inmueble.SuperficieTotal = SuperficieTotal;
                inmueble.SuperficieCubierta = SuperficieCubierta;
                inmueble.TipoOperacion = TipoOperacion;
                inmueble.TipoInmueble = TipoInmueble;
                inmueble.Amoblado = Amoblado;
                inmueble.Dormitorios = Dormitorios;
                inmueble.Banios = Banios;
                inmueble.CantidadAmbientes = CantidadAmbientes;
                inmueble.Cochera = Cochera;
                inmueble.Direccion = Direccion;
                inmueble.NroDireccion = NroDireccion;
                inmueble.Descripcion = Descripcion;
                inmueble.UsuarioID = UsuarioID;

                if (InmuebleID == 0)
                {
                    _context.Add(inmueble);
                    _context.SaveChanges();
                    resultado = " guardado correctamente";
                }
                else
                {
                    _context.SaveChanges();
                    resultado = " editado correctamente";
                }

                if (Imagenes != null && Imagenes.Count > 0)
                {
                    foreach (var imagen in Imagenes)
                    {
                        using (var memoryStream = new System.IO.MemoryStream())
                        {
                            imagen.CopyTo(memoryStream);
                            var imagenEntity = new Imagen
                            {
                                ImagenByte = memoryStream.ToArray(),
                                ContentType = imagen.ContentType,
                                NombreArchivo = imagen.FileName,
                                InmuebleID = inmueble.InmuebleID,
                                // UsuarioID = UsuarioID
                            };
                            _context.Imagenes.Add(imagenEntity);
                        }
                    }
                    _context.SaveChanges();
                }
            }
        }

        return Json(resultado);
    }


    public JsonResult EliminarPublicacion(int InmuebleID)
    {
        var eliminarPublicacion = _context.Inmuebles.Find(InmuebleID);
        _context.Remove(eliminarPublicacion);
        _context.SaveChanges();

        return Json(eliminarPublicacion);
    }




    public IActionResult Detalle(int InmuebleID)
{

    return View();
}
}

