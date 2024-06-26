using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using ProyectARG.Data;
using ProyectARG.Models;

namespace ProyectARG.Controllers;

public class ProvinciasController : Controller
{
    private ApplicationDbContext _context;

    public ProvinciasController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }


    public JsonResult ListadoProvincias(int ProvinciaID)
    {
        var provincia = _context.Provincias.ToList();

        if (ProvinciaID != 0)
        {
            provincia = _context.Provincias.Where(t => t.ProvinciaID == ProvinciaID).ToList();
        }

        return Json(provincia);
    }


    public JsonResult GuardarProvincia(int ProvinciaID, string Nombre)
    {
        string resultado = "";

        if (!String.IsNullOrEmpty(Nombre))
        {
            Nombre = Nombre.ToUpper();
            
            if (ProvinciaID == 0)
            {
                var existeProvincia = _context.Provincias.Where(t => t.Nombre == Nombre).Count();
                if (existeProvincia == 0)
                {
                    var provincia = new Provincia
                    {
                        Nombre = Nombre
                    };
                    _context.Add(provincia);
                    _context.SaveChanges();
                }
                else
                {
                    resultado = "ESTA PROVINCIA YA EXISTE";
                }
            }
            else
            {
                var provinciaEditar = _context.Provincias.Where(t => t.ProvinciaID == ProvinciaID).SingleOrDefault();
                if(provinciaEditar != null)
                {
                    var existeProvincia = _context.Provincias.Where(t => t.Nombre == Nombre && t.ProvinciaID != ProvinciaID).Count();
                    if(existeProvincia == 0)
                    {
                        //QUIERE DECIR QUE EL ELEMENTO Y ES CORRECTO, ENTONCES CONTINUAMOS CON EL EDITAR
                        provinciaEditar.Nombre = Nombre;
                        _context.SaveChanges();
                    }
                    else{
                    resultado = "ESTA PROVINCIA YA EXISTE";
                    }
                }
                else
                {
                    resultado = "ESTA PROVINCIA YA EXISTE";
                }
            }
        }
        else
        {
            resultado = "DEBE INGRESAR UN NOMBRE DE PROVINCIA";
        }
        return Json(resultado);
    }

    public JsonResult EliminarProvincia(int ProvinciaID)
    {
        var eliminarProvincia = _context.Provincias.Find(ProvinciaID);
        _context.Remove(eliminarProvincia);
        _context.SaveChanges();

        return Json(eliminarProvincia);
    }
}
