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


    public JsonResult GetDetallePublicacion(int InmuebleID)
    {
        var Detalle = _context.Inmuebles.ToList();
        if (InmuebleID != 0)
        {
            Detalle = Detalle.Where(i => i.InmuebleID == InmuebleID).ToList();
        }
        return Json(Detalle);
    }



    public JsonResult GuardarPublicacion(int InmuebleID, int LocalidadID, string? Barrio, string? Titulo,
        float? Precio, int? SuperficieTotal, int? SuperficieCubierta, Operacion TipoOperacion,
        TipoInmueble TipoInmueble, bool Amoblado, int Dormitorios, int Banios, int CantidadAmbientes,
        bool Cochera, string? Direccion, int NroDireccion, string? Descripcion, int? UsuarioID)
    {
        string resultado = "";

        if (InmuebleID != null)
        {
            if (InmuebleID == 0)
            {
                var Inmueble = new Inmueble
                {
                    InmuebleID = InmuebleID,
                    LocalidadID = LocalidadID,
                    Barrio = Barrio,
                    Titulo = Titulo,
                    Precio = Precio,
                    SuperficieTotal = SuperficieTotal,
                    SuperficieCubierta = SuperficieCubierta,
                    TipoOperacion = TipoOperacion,
                    TipoInmueble = TipoInmueble,
                    Amoblado = Amoblado,
                    Dormitorios = Dormitorios,
                    Banios = Banios,
                    CantidadAmbientes = CantidadAmbientes,
                    Cochera = Cochera,
                    Direccion = Direccion,
                    NroDireccion = NroDireccion,
                    Descripcion = Descripcion,
                    UsuarioID = UsuarioID
                };
                _context.Add(Inmueble);
                _context.SaveChanges();
                resultado = " guardado correctamente";
            }
            else
            {
                var PublicacionEditar = _context.Inmuebles.Where(t => t.InmuebleID == InmuebleID).SingleOrDefault();
                if (PublicacionEditar != null)
                {
                    PublicacionEditar.LocalidadID = LocalidadID;
                    PublicacionEditar.Barrio = Barrio;
                    PublicacionEditar.Titulo = Titulo;
                    PublicacionEditar.Precio = Precio;
                    PublicacionEditar.SuperficieTotal = SuperficieTotal;
                    PublicacionEditar.SuperficieCubierta = SuperficieCubierta;
                    PublicacionEditar.TipoOperacion = TipoOperacion;
                    PublicacionEditar.TipoInmueble = TipoInmueble;
                    PublicacionEditar.Amoblado = Amoblado;
                    PublicacionEditar.Dormitorios = Dormitorios;
                    PublicacionEditar.Banios = Banios;
                    PublicacionEditar.CantidadAmbientes = CantidadAmbientes;
                    PublicacionEditar.Cochera = Cochera;
                    PublicacionEditar.Direccion = Direccion;
                    PublicacionEditar.NroDireccion = NroDireccion;
                    PublicacionEditar.Descripcion = Descripcion;
                    PublicacionEditar.UsuarioID = UsuarioID;
                    _context.SaveChanges();
                    resultado = " editado correctamente";
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




    public IActionResult Detalle(){

        return View();
    }
}

