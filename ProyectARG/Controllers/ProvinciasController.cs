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
        var provincia = _context.Provincias.OrderBy(c => c.Nombre).ToList();
        if (ProvinciaID != 0)
        {
            provincia = _context.Provincias.Where(t => t.ProvinciaID == ProvinciaID).ToList();
        }
        return Json(provincia);
    }

    public JsonResult GuardarProvincia(int ProvinciaID, string Nombre)
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
                    resultado = new
                    {
                        titulo = "Provincia creada",
                        texto = "La provincia se ha creado correctamente",
                        error = false
                    };
                }
                else
                {
                    resultado = new
                    {
                        titulo = "Provincia existente",
                        texto = "La provincia ya existe",
                        error = true
                    };
                }
            }
            else
            {
                var provinciaEditar = _context.Provincias.Where(t => t.ProvinciaID == ProvinciaID).SingleOrDefault();
                if (provinciaEditar != null)
                {
                    var existeProvincia = _context.Provincias.Where(t => t.Nombre == Nombre && t.ProvinciaID != ProvinciaID).Count();
                    if (existeProvincia == 0)
                    {
                        //QUIERE DECIR QUE EL ELEMENTO Y ES CORRECTO, ENTONCES CONTINUAMOS CON EL EDITAR
                        provinciaEditar.Nombre = Nombre;
                        _context.SaveChanges();
                        resultado = new
                        {
                            titulo = "Provincia editada",
                            texto = "La provincia se ha editado correctamente",
                            error = false
                        };
                    }
                    else
                    {
                        resultado = new
                        {
                            titulo = "Provincia existente",
                            texto = "La provincia ya existe",
                            error = true
                        };
                    }
                }
                else
                {
                    resultado = new
                    {
                        titulo = "Provincia existente",
                        texto = "La provincia ya existe",
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
                texto = "El nombre de la provincia no puede ser vacío",
                error = true
            };
        }
        return Json(resultado);
    }

    public JsonResult EliminarProvincia(int ProvinciaID)
    {
        var relacion = _context.Localidades.Where(t => t.ProvinciaID == ProvinciaID).Count();
        var resultado = new
        {
            titulo = "",
            texto = "",
            error = false
        };
        if (relacion == 0)
        {
            var eliminarProvincia = _context.Provincias.Find(ProvinciaID);
            _context.Remove(eliminarProvincia);
            _context.SaveChanges();
            resultado = new
            {
                titulo = "Provincia eliminada",
                texto = "La provincia se ha eliminado correctamente",
                error = false
            };
        }
        else
        {
            resultado = new
            {
                titulo = "Hay un problema",
                texto = "La provincia no puede ser eliminada porque tiene localidades relacionadas",
                error = true
            };
        }
        return Json(resultado);
    }
}
