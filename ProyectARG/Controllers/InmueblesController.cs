using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectARG.Models;
using ProyectARG.Data;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Security.Claims;

namespace ProyectARG.Controllers;
// [Authorize]
public class InmueblesController : Controller
{
    private ApplicationDbContext _context;

    public InmueblesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index(int? UsuarioID)
    {

        var selectListItemsOperacion = new List<SelectListItem>
    {
        new SelectListItem { Value = "0", Text = "[Tipo de operación...] *" }
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
        new SelectListItem { Value = "0", Text = "[Tipo de inmueble...] *" }
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

        provincias.Add(new Provincia { ProvinciaID = 0, Nombre = "[Provincia...] *" });
        ViewBag.ProvinciaID = new SelectList(provincias.OrderBy(c => c.Nombre), "ProvinciaID", "Nombre");

        localidades.Add(new Localidad { LocalidadID = 0, Nombre = "[Localidad...] *" });
        ViewBag.LocalidadID = new SelectList(localidades.OrderBy(c => c.Nombre), "LocalidadID", "Nombre");

        ViewBag.Operaciones = selectListItemsOperacion;
        ViewBag.TiposInmueble = selectListItemsTipoInmueble;

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        UsuarioID = _context.Usuarios
                .Where(t => t.CuentaID == userId)
                .Select(t => t.UsuarioID) // Proyecta solo el campo UsuarioID
                .SingleOrDefault(); ;

        ViewBag.UsuarioID = UsuarioID;

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

    public JsonResult GetDataInmueble(int InmuebleID)
    {

        List<GetDataInmueble> inmuebleMostrar = new List<GetDataInmueble>();

        var inmueble = _context.Inmuebles.Where(t => t.InmuebleID == InmuebleID).SingleOrDefault();
        var localidad = _context.Localidades.Where(t => t.LocalidadID == inmueble.LocalidadID).SingleOrDefault();

        var vistaDataInmueble = new GetDataInmueble
        {
            ProvinciaID = localidad.ProvinciaID,
            LocalidadID = inmueble.LocalidadID,
            TipoInmueble = inmueble.TipoInmueble,
            TipoOperacion = inmueble.TipoOperacion,
        };

        inmuebleMostrar.Add(vistaDataInmueble);
        return Json(inmuebleMostrar);
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
                if (InmuebleID == 0)
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
                    inmueble.Activo = true;

                    _context.Add(inmueble);
                    _context.SaveChanges();
                    resultado = " guardado correctamente";
                }
                else if (InmuebleID != 0 && UsuarioID == inmueble.UsuarioID)
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
                    _context.SaveChanges();
                    resultado = " editado correctamente";
                }
                else{
                    resultado = "No tiene permisos para editar esta publicacion";
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


public JsonResult suspenderPublicacion(int InmuebleID){

    var inmueble = _context.Inmuebles.Find(InmuebleID);

    string resultado = "";

    if(inmueble.Activo == true){
        inmueble.Activo = false;
        resultado = "Publicacion suspendida";
    }
    else{
        inmueble.Activo = true;
        resultado = "Publicacion activada";
    }
    _context.SaveChanges();
    return Json(resultado);
}

    public JsonResult EliminarPublicacion(int InmuebleID, int UsuarioID)
    {
        var resultado = new
        {
            Titulo = "",
            Error = "",
            eliminado = false
        };
        var eliminarPublicacion = _context.Inmuebles.Find(InmuebleID);
        if (eliminarPublicacion.UsuarioID == UsuarioID)
        {
            _context.Remove(eliminarPublicacion);
            _context.SaveChanges();

            resultado = new
            {
                Titulo = "Felicitaciones!!!",
                Error = "La publicacion a sido eliminada correctamente",
                eliminado = true
            };
        }
        else
        {
            resultado = new
            {
                Titulo = "Hubo un problema",
                Error = "Usted no es propietario de esta publicacion",
                eliminado = false
            };
        }

        return Json(resultado);
    }




    public IActionResult Detalle(int InmuebleID)
    {

        return View();
    }
}

