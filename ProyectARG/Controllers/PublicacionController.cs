using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectARG.Models;
using ProyectARG.Data;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.AspNetCore.Authorization;

namespace ProyectARG.Controllers;
// [Authorize]
public class PublicacionController : Controller
{
    private  ApplicationDbContext _context;

    public PublicacionController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }

    public JsonResult GuardarPublicacion(int InmuebleID, int LocalidadID, string? Barrio, string? Titulo, 
        float? Precio, int? SuperficieTotal, int? SuperficieCubierta, Operacion TipoOperacion, 
        TipoInmueble TipoInmueble, bool Amoblado, int Dormitorios, int Banios, int CantidadAmbientes, 
        bool Cochera, string? Direccion, int NroDireccion, string? Descripcion, int? UsuarioID)
    {
        string resultado = "";
        
        if (InmuebleID != null)
        {
            if (InmuebleID != 0)
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
        }
        return Json(resultado);
    }


    public JsonResult EliminarPublicacion(int InmuebleID)
    {
        var Inmueble = _context.Inmuebles.Find(InmuebleID);
        _context.Remove(Inmueble);
        _context.SaveChanges();

        return Json(true);
    }
}
