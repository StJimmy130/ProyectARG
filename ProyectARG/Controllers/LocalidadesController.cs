using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using ProyectARG.Data;
using ProyectARG.Models;

namespace ProyectARG.Controllers;

[Authorize(Roles = "ADMINISTRADOR")]
public class LocalidadesController : Controller
{
    private ApplicationDbContext _context;

    public LocalidadesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        var provincias = _context.Provincias.ToList();
        provincias.Add(new Provincia{ProvinciaID = 0, Nombre = "[SELECCIONE...]"});
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
            
            if(mostrar)
            {
                var localidadMostrar = new VistaLocalidad{
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


    public JsonResult GuardarLocalidad(int LocalidadID,int ProvinciaID, string Nombre)
    {
        string resultado = "";

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
                }
                else
                {
                    resultado = "ESTA LOCALIDAD YA EXISTE";
                }
            }
            else
            {
                var localidadEditar = _context.Localidades.Where(t => t.LocalidadID == LocalidadID).SingleOrDefault();
                if(localidadEditar != null)
                {
                    var existeLocalidad = _context.Localidades.Where(t => t.Nombre == Nombre && t.LocalidadID != LocalidadID).Count();
                    if(existeLocalidad == 0)
                    {
                        //QUIERE DECIR QUE EL ELEMENTO Y ES CORRECTO, ENTONCES CONTINUAMOS CON EL EDITAR
                        localidadEditar.Nombre = Nombre;
                        localidadEditar.ProvinciaID = ProvinciaID;
                        _context.SaveChanges();
                    }
                    else{
                    resultado = "ESTA LOCALIDAD YA EXISTE";
                    }
                }
                else
                {
                    resultado = "ESTA LOCALIDAD YA EXISTE";
                }
            }
        }
        else
        {
            resultado = "DEBE INGRESAR UN NOMBRE DE LOCALIDAD";
        }
        return Json(resultado);
    }

    public JsonResult EliminarLocalidad(int LocalidadID)
    {
        var eliminarLocalidad = _context.Localidades.Find(LocalidadID);
        _context.Remove(eliminarLocalidad);
        _context.SaveChanges();

        return Json(eliminarLocalidad);
    }
}
