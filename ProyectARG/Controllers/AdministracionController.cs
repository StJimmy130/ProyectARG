using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ProyectARG.Data;
using ProyectARG.Models;

namespace ProyectARG.Controllers;

[Authorize(Roles = "ADMINISTRADOR")]
public class AdministracionController : Controller
{
    private ApplicationDbContext _context;

    public AdministracionController(ApplicationDbContext context)
    {
        _context = context;
    }


    public IActionResult Index()
    {
        return View();
    }



    public IActionResult InformePublicacionesPorUsuario()
    {
        return View();
    }

    private string SplitCamelCase(string input)
    {
        return System.Text.RegularExpressions.Regex.Replace(input, "(\\B[A-Z])", " $1");
    }


    public JsonResult GetInformePublicacionesPorUsuario(int? id)
    {
        List<VistaInmueble> informePublicacionesPorUsuarioMostrar = new List<VistaInmueble>();

        var inmuebles = _context.Inmuebles.ToList();


        var usuarios = _context.Usuarios.ToList();
        var Provincias = _context.Provincias.ToList();
        var Localidades = _context.Localidades.ToList();

        foreach (var inmueble in inmuebles)
        {

            var usuario = usuarios.Where(t => t.UsuarioID == inmueble.UsuarioID).SingleOrDefault();
            var provincia = Provincias.Where(t => t.ProvinciaID == inmueble.Localidad.ProvinciaID).SingleOrDefault();
            var localidad = Localidades.Where(t => t.LocalidadID == inmueble.LocalidadID).SingleOrDefault();

            var informePublicacionPorUsuarioMostrar = new VistaInmueble
            {
                InmuebleID = inmueble.InmuebleID,
                NombreUsuario = usuario.Nombre,
                UsuarioID = inmueble.UsuarioID,
                LocalidadID = inmueble.LocalidadID,
                TituloString = inmueble.Titulo,
                LocalidadString = localidad.Nombre,
                ProvinciaString = provincia.Nombre,
                BarrioString = inmueble.Barrio,
                Moneda = inmueble.Moneda,
                PrecioString = inmueble.Precio.ToString(),
                TipoOperacionString = SplitCamelCase(inmueble.TipoOperacion.ToString()),
                TipoInmuebleString = SplitCamelCase(inmueble.TipoInmueble.ToString()),
                DireccionString = inmueble.Direccion,
                NroDireccionString = inmueble.NroDireccion,
            };
            informePublicacionesPorUsuarioMostrar.Add(informePublicacionPorUsuarioMostrar);
        }
        informePublicacionesPorUsuarioMostrar = informePublicacionesPorUsuarioMostrar.ToList();

        return Json(informePublicacionesPorUsuarioMostrar);
    }


    public IActionResult InformePublicacionesPorProvincia()
    {
        return View();
    }


    public JsonResult GetInformePublicacionesPorProvincia(int? id)
    {
        List<VistaInmueble> informePublicacionesPorProvinciaMostrar = new List<VistaInmueble>();

        var inmuebles = _context.Inmuebles.ToList();


        var usuarios = _context.Usuarios.ToList();
        var Provincias = _context.Provincias.ToList();
        var Localidades = _context.Localidades.ToList();

        foreach (var inmueble in inmuebles)
        {

            var usuario = usuarios.Where(t => t.UsuarioID == inmueble.UsuarioID).SingleOrDefault();
            var provincia = Provincias.Where(t => t.ProvinciaID == inmueble.Localidad.ProvinciaID).SingleOrDefault();
            var localidad = Localidades.Where(t => t.LocalidadID == inmueble.LocalidadID).SingleOrDefault();

            var informePublicacionPorProvinciaMostrar = new VistaInmueble
            {
                InmuebleID = inmueble.InmuebleID,
                LocalidadID = inmueble.LocalidadID,
                UsuarioID = inmueble.UsuarioID,
                ProvinciaString = provincia.Nombre,
                LocalidadString = localidad.Nombre,
                NombreUsuario = usuario.Nombre,
                TituloString = inmueble.Titulo,
                Moneda = inmueble.Moneda,
                PrecioString = inmueble.Precio.ToString(),
                TipoOperacionString = SplitCamelCase(inmueble.TipoOperacion.ToString()),
                TipoInmuebleString = SplitCamelCase(inmueble.TipoInmueble.ToString()),
                BarrioString = inmueble.Barrio,
                DireccionString = inmueble.Direccion,
                NroDireccionString = inmueble.NroDireccion,
            };
            informePublicacionesPorProvinciaMostrar.Add(informePublicacionPorProvinciaMostrar);
        }
        informePublicacionesPorProvinciaMostrar = informePublicacionesPorProvinciaMostrar.ToList();

        return Json(informePublicacionesPorProvinciaMostrar);
    }


    public IActionResult InformePublicacionesPorFecha()
    {
        return View();
    }


    public JsonResult GetInformePublicacionesPorFecha(int? id)
    {
        List<VistaInmueble> informePublicacionesPorFechaMostrar = new List<VistaInmueble>();

        var inmuebles = _context.Inmuebles.ToList();


        var usuarios = _context.Usuarios.ToList();
        var Provincias = _context.Provincias.ToList();
        var Localidades = _context.Localidades.ToList();

        foreach (var inmueble in inmuebles)
        {

            var usuario = usuarios.Where(t => t.UsuarioID == inmueble.UsuarioID).SingleOrDefault();
            var provincia = Provincias.Where(t => t.ProvinciaID == inmueble.Localidad.ProvinciaID).SingleOrDefault();
            var localidad = Localidades.Where(t => t.LocalidadID == inmueble.LocalidadID).SingleOrDefault();
            var cantidadVistas = _context.Vistas.Count(v => v.InmuebleID == inmueble.InmuebleID);

            var informePublicacionPorFechaMostrar = new VistaInmueble
            {
                InmuebleID = inmueble.InmuebleID,
                LocalidadID = inmueble.LocalidadID,
                CantidadVistas = cantidadVistas,
                UsuarioID = inmueble.UsuarioID,
                FechaPublicacionString = inmueble.FechaAlta.ToString("ddd dd 'de' MMM yyyy"),
                ProvinciaString = provincia.Nombre,
                LocalidadString = localidad.Nombre,
                NombreUsuario = usuario.Nombre,
                TituloString = inmueble.Titulo,
                Moneda = inmueble.Moneda,
                PrecioString = inmueble.Precio.ToString(),
                TipoOperacionString = SplitCamelCase(inmueble.TipoOperacion.ToString()),
                TipoInmuebleString = SplitCamelCase(inmueble.TipoInmueble.ToString()),
                BarrioString = inmueble.Barrio,
                DireccionString = inmueble.Direccion,
                NroDireccionString = inmueble.NroDireccion,
            };
            informePublicacionesPorFechaMostrar.Add(informePublicacionPorFechaMostrar);
        }
        informePublicacionesPorFechaMostrar = informePublicacionesPorFechaMostrar.ToList();

        return Json(informePublicacionesPorFechaMostrar);
    }

    public IActionResult Localidades()
    {
        var provincias = _context.Provincias.ToList();
        provincias.Add(new Provincia { ProvinciaID = 0, Nombre = "[SELECCIONE...]" });
        ViewBag.ProvinciaID = new SelectList(provincias.OrderBy(c => c.Nombre), "ProvinciaID", "Nombre");
        ViewBag.ProvinciaIDEdit = new SelectList(provincias.OrderBy(c => c.Nombre), "ProvinciaID", "Nombre");

        return View();
    }


    public JsonResult ListadoLocalidades(int LocalidadID, int? ProvinciaID)
    {
        List<VistaLocalidad> localidadesMostrar = new List<VistaLocalidad>();

        var localidades = _context.Localidades.OrderBy(c => c.Nombre).ToList();

        if (LocalidadID != 0)
        {
            localidades = _context.Localidades.Where(t => t.LocalidadID == LocalidadID).ToList();
        }

        var provincias = _context.Provincias.ToList();

        foreach (var localidad in localidades)
        {
            bool mostrar = true;
            var provincia = provincias.Where(t => t.ProvinciaID == localidad.ProvinciaID).Single();

            if ((ProvinciaID ?? 0) != 0 && localidad.ProvinciaID != ProvinciaID)
            {
                mostrar = false;
            }

            if (mostrar)
            {
                var localidadMostrar = new VistaLocalidad
                {
                    LocalidadID = localidad.LocalidadID,
                    LocalidadNombre = localidad.Nombre,
                    ProvinciaID = localidad.ProvinciaID,
                    ProvinciaNombre = provincia.Nombre
                };
                localidadesMostrar.Add(localidadMostrar);
            }

        }

        return Json(localidadesMostrar);
    }


    public JsonResult GuardarLocalidad(int LocalidadID, int ProvinciaID, string Nombre)
    {
        var resultado = new
        {
            titulo = "",
            texto = "",
            error = false
        };

        if (!String.IsNullOrEmpty(Nombre))
        {
            Nombre = char.ToUpper(Nombre[0]) + Nombre.Substring(1).ToLower();

            if (LocalidadID == 0)
            {
                var existeLocalidad = _context.Localidades.Where(t => t.Nombre == Nombre).Count();
                if (existeLocalidad == 0)
                {
                    var Localidad = new Localidad
                    {
                        LocalidadID = LocalidadID,
                        Nombre = Nombre,
                        ProvinciaID = ProvinciaID
                    };
                    _context.Add(Localidad);
                    _context.SaveChanges();
                    resultado = new
                    {
                        titulo = "LOCALIDAD CREADA",
                        texto = "La localidad se ha creado correctamente",
                        error = false
                    };
                }
                else
                {
                    resultado = new
                    {
                        titulo = "ESTA LOCALIDAD YA EXISTE",
                        texto = "No se puede crear otra localidad con el mismo nombre",
                        error = true
                    };
                }
            }
            else
            {
                var localidadEditar = _context.Localidades.Where(t => t.LocalidadID == LocalidadID).SingleOrDefault();
                if (localidadEditar != null)
                {
                    var existeLocalidad = _context.Localidades.Where(t => t.Nombre == Nombre && t.LocalidadID != LocalidadID).Count();
                    if (existeLocalidad == 0)
                    {
                        //QUIERE DECIR QUE EL ELEMENTO Y ES CORRECTO, ENTONCES CONTINUAMOS CON EL EDITAR
                        localidadEditar.Nombre = Nombre;
                        localidadEditar.ProvinciaID = ProvinciaID;
                        _context.SaveChanges();
                        resultado = new
                        {
                            titulo = "LOCALIDAD EDITADA",
                            texto = "La localidad se ha editado correctamente",
                            error = false
                        };
                    }
                    else
                    {
                        resultado = new
                        {
                            titulo = "ESTA LOCALIDAD YA EXISTE",
                            texto = "No se puede crear otra localidad con el mismo nombre",
                            error = true
                        };
                    }
                }
                else
                {
                    resultado = new
                    {
                        titulo = "ESTA LOCALIDAD YA EXISTE",
                        texto = "No se puede crear otra localidad con el mismo nombre",
                        error = true
                    };
                }
            }
        }
        else
        {
            resultado = new
            {
                titulo = "Advertencia",
                texto = "El nombre de la localidad no puede ser vacío",
                error = true
            };
        }
        return Json(resultado);
    }

    public JsonResult EliminarLocalidad(int LocalidadID)
    {
        var relacion = _context.Inmuebles.Where(t => t.LocalidadID == LocalidadID).Count();
        var resultado = new
        {
            titulo = "",
            texto = "",
            error = false
        };
        if (relacion == 0)
        {
            var eliminarLocalidad = _context.Localidades.Find(LocalidadID);
            _context.Remove(eliminarLocalidad);
            _context.SaveChanges();

            resultado = new
            {
                titulo = "Localidad eliminada",
                texto = "La localidad se ha eliminado correctamente",
                error = false
            };
        }
        else
        {
            resultado = new
            {
                titulo = "Hay un problema",
                texto = "La localidad no puede ser eliminada porque tiene inmuebles relacionados",
                error = true
            };
        }

        return Json(resultado);
    }



    public IActionResult InformesGraficos()
    {
        return View();
    }

    public JsonResult InmueblesPorProvincia()
    {
        var inmueblesPorProvincia = _context.Inmuebles
            .Include(inmueble => inmueble.Localidad.Provincias) // Incluir la provincia relacionada
            .Where(i => i.Activo) // Filtrar solo inmuebles activos
            .GroupBy(i => i.Localidad.Provincias.Nombre) // Agrupar por el nombre de la provincia
            .Select(g => new
            {
                Provincia = g.Key,
                CantidadInmuebles = g.Count()
            })
            .ToList();

        return Json(inmueblesPorProvincia);
    }




}
