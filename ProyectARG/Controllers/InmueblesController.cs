using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectARG.Models;
using ProyectARG.Data;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Security.Claims;
using System.Globalization;

namespace ProyectARG.Controllers;

public class InmueblesController : Controller
{
    private ApplicationDbContext _context;

    public InmueblesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize]
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
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

    var UsuarioID = _context.Usuarios
            .Where(t => t.CuentaID == userId)
            .Select(t => t.UsuarioID)
            .SingleOrDefault();

    var visitaExistente = _context.Vistas
        .Where(t => t.InmuebleID == InmuebleID && t.UsuarioID == UsuarioID)
        .OrderByDescending(v => v.VistaFecha)
        .FirstOrDefault();  // Obtenemos solo la última visita, si existe

    bool crearNuevaVisita = false;

    if (visitaExistente != null)
    {
        var diferenciaHorario = DateTime.Now - visitaExistente.VistaFecha;
        if (diferenciaHorario.TotalHours > 24)
        {
            crearNuevaVisita = true;
        }
    }
    else
    {
        crearNuevaVisita = true;
    }

    if (crearNuevaVisita)
    {
        var nuevaVisita = new Vista
        {
            InmuebleID = InmuebleID,
            UsuarioID = UsuarioID,
            VistaFecha = DateTime.Now
        };

        _context.Vistas.Add(nuevaVisita);
        _context.SaveChanges();
    }

    // Lógica para obtener y retornar los detalles de la publicación...
    List<VistaInmueble> inmuebleDetalleMostrar = new List<VistaInmueble>();

    // Aplicar filtros y obtener los inmuebles
    var inmueblesQuery = _context.Inmuebles.AsQueryable();

    if (localidadID.HasValue && localidadID.Value != 0)
    {
        inmueblesQuery = inmueblesQuery.Where(t => t.LocalidadID == localidadID.Value);
    }

    if (InmuebleID != 0)
    {
        inmueblesQuery = inmueblesQuery.Where(t => t.InmuebleID == InmuebleID);
    }

    var inmuebles = inmueblesQuery.OrderByDescending(t => t.FechaAlta).ToList();
    var imagenes = _context.Imagenes.ToList(); 
    var provincias = _context.Provincias.ToList();
    var localidades = _context.Localidades.ToList();

    foreach (var inmueble in inmuebles)
    {
        var localidad = localidades.SingleOrDefault(t => t.LocalidadID == inmueble.LocalidadID);
        var provincia = provincias.SingleOrDefault(t => t.ProvinciaID == localidad?.ProvinciaID);
        var usuario = _context.Usuarios.SingleOrDefault(t => t.UsuarioID == inmueble.UsuarioID);

        var imagenesInmueble = imagenes.Where(img => img.InmuebleID == inmueble.InmuebleID).ToList();
        var imagenesBase64 = imagenesInmueble.Select(imagen => new ImagenVista
        {
            ImagenID = imagen.ImagenID,
            ImagenSrc = $"data:{imagen.ContentType};base64,{Convert.ToBase64String(imagen.ImagenByte)}"
        }).ToList();

        var vistaInmueble = new VistaInmueble
        {
            InmuebleID = inmueble.InmuebleID,
            TituloString = inmueble.Titulo,
            DatosUsuario = new List<DatosUsuario>(),
            ProvinciaString = provincia?.Nombre,
            LocalidadString = localidad?.Nombre,
            BarrioString = inmueble.Barrio,
            DireccionString = inmueble.Direccion,
            NroDireccionString = inmueble.NroDireccion,
            SuperficieTotalString = inmueble.SuperficieTotal.ToString(),
            SuperficieCubiertaString = inmueble.SuperficieCubierta.ToString(),
            AmobladoString = inmueble.Amoblado.ToString(),
            DormitoriosString = inmueble.Dormitorios.ToString(),
            BaniosString = inmueble.Banios.ToString(),
            CantidadAmbientesString = inmueble.CantidadAmbientes.ToString(),
            CocheraString = inmueble.Cochera.ToString(),
            DescripcionString = inmueble.Descripcion,
            PrecioString = inmueble.Precio.ToString(),
            TipoOperacionString = inmueble.TipoOperacion.ToString(),
            TipoInmuebleString = inmueble.TipoInmueble.ToString(),
            Moneda = inmueble.Moneda,
            Imagenes = imagenesBase64,
            FechaPublicacionString = $"{inmueble.FechaAlta:dd} de {inmueble.FechaAlta:MMMM} del {inmueble.FechaAlta:yyyy}"
        };

        var datosUsuario = new DatosUsuario
        {
            Nombre = usuario.Nombre,
            Whatsapp = usuario.Whatsapp,
            Facebook = usuario.Facebook,
            Instagram = usuario.Instagram,
            NroTelefono = usuario.NroTelefono
        };

        vistaInmueble.DatosUsuario.Add(datosUsuario);
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


    [Authorize]
    public JsonResult GuardarPublicacion(int InmuebleID, int LocalidadID, string? Barrio, string? Titulo,
    float? Precio, int? SuperficieTotal, int? SuperficieCubierta, Operacion TipoOperacion,
    TipoInmueble TipoInmueble, bool Amoblado, int Dormitorios, int Banios, int CantidadAmbientes,
    bool Cochera, string? Direccion, int NroDireccion, string? Descripcion, int? UsuarioID,
    List<IFormFile> Imagenes, bool Moneda)
    {
        var resultado = new
        {
            texto = "",
            estado = false
        };

        if (InmuebleID != null)
        {
            // Si es nuevo, crea un nuevo inmueble
            Inmueble inmueble = InmuebleID == 0 ? new Inmueble() : _context.Inmuebles.SingleOrDefault(t => t.InmuebleID == InmuebleID);

            if (inmueble != null)
            {
                if (InmuebleID == 0) // Nuevo inmueble
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
                    inmueble.Moneda = Moneda;
                    inmueble.Activo = true;

                    // Asigna la fecha actual cuando se crea la publicación
                    inmueble.FechaAlta = DateTime.Now;

                    _context.Add(inmueble);
                    _context.SaveChanges();

                    resultado = new
                    {
                        texto = " Guardado correctamente",
                        estado = true
                    };
                }
                else if (InmuebleID != 0 && UsuarioID == inmueble.UsuarioID) // Edición de inmueble existente
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
                    inmueble.Moneda = Moneda;

                    _context.SaveChanges();

                    resultado = new
                    {
                        texto = " Editado correctamente",
                        estado = true
                    };
                }
                else
                {
                    resultado = new
                    {
                        texto = "No tiene permisos para editar esta publicacion",
                        estado = false
                    };
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
                                InmuebleID = inmueble.InmuebleID
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


    public JsonResult SuspenderPublicacion(int InmuebleID)
    {

        var inmueble = _context.Inmuebles.Find(InmuebleID);
        var Usuario = User.FindFirst(ClaimTypes.Role)?.Value;


        var resultado = new
        {
            Titulo = "",
            Error = "",
            estado = false
        };
        if (Usuario == "ADMINISTRADOR" && inmueble.Activo == true)
        {
            inmueble.Activo = false;
            inmueble.Admin = true;
            resultado = new
            {
                Titulo = "Publicacion suspendida",
                Error = "Publicacion suspendida con exito",
                estado = true
            };
        }
        else if (Usuario == "ADMINISTRADOR" && inmueble.Activo == false)
        {
            inmueble.Activo = true;
            inmueble.Admin = true;
            resultado = new
            {
                Titulo = "Publicacion activada",
                Error = "Publicacion activada con exito",
                estado = false
            };
        }

        else if (inmueble.Activo == true && inmueble.Admin == false)
        {
            inmueble.Activo = false;
            resultado = new
            {
                Titulo = "Publicacion suspendida",
                Error = "Publicacion suspendida con exito",
                estado = true
            };
        }
        else if (inmueble.Activo == false && inmueble.Admin == false)
        {
            inmueble.Activo = true;
            resultado = new
            {
                Titulo = "Publicacion activada",
                Error = "Publicacion activada con exito",
                estado = false
            };
        }
        else
        {
            resultado = new
            {
                Titulo = "Hubo un problema",
                Error = "La publicacion fue suspendida por un administrador",
                estado = true
            };
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
            estado = false
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
                estado = true
            };
        }
        else
        {
            resultado = new
            {
                Titulo = "Hubo un problema",
                Error = "Usted no es propietario de esta publicacion",
                estado = false
            };
        }

        return Json(resultado);
    }




    public IActionResult Detalle(int InmuebleID, int? UsuarioID)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        UsuarioID = _context.Usuarios
                .Where(t => t.CuentaID == userId)
                .Select(t => t.UsuarioID) // Proyecta solo el campo UsuarioID
                .SingleOrDefault();

        ViewBag.UsuarioID = UsuarioID;

        return View();
    }
}

