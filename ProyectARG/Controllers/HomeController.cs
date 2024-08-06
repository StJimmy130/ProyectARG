using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectARG.Models;
using ProyectARG.Data;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace ProyectARG.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    private ApplicationDbContext _context;

    public HomeController(ApplicationDbContext context, ILogger<HomeController> logger)
    {
        _logger = logger;
        _context = context;
    }


    public IActionResult Index()
    {
        var localidades = _context.Localidades.ToList();
        var provincias = _context.Provincias.ToList();

        provincias.Add(new Provincia { ProvinciaID = 0, Nombre = "[SELECCIONE...]" });
        ViewBag.ProvinciaID = new SelectList(provincias.OrderBy(c => c.Nombre), "ProvinciaID", "Nombre");

        localidades.Add(new Localidad { LocalidadID = 0, Nombre = "[SELECCIONE...]" });
        ViewBag.LocalidadID = new SelectList(localidades.OrderBy(c => c.Nombre), "LocalidadID", "Nombre");

        return View();
    }

    public JsonResult GetLocalidadesByProvincia(int provinciaID)
{
    var localidades = _context.Localidades
                              .Where(l => l.ProvinciaID == provinciaID)
                              .OrderBy(l => l.Nombre)
                              .ToList();

    return Json(localidades);
}


    public JsonResult GetPublicaciones(int InmuebleID)
    {
        var Listado = _context.Inmuebles.ToList();
        if (InmuebleID != 0)
        {
            Listado = Listado.Where(i => i.InmuebleID == InmuebleID).ToList();
        }

        return Json(Listado);
    }

    public JsonResult ListadoInmuebles(int InmuebleID, int? provinciaID, int? localidadID, List<TipoInmueble> TipoInmueble, int? precioMinimo, int? precioMaximo, Operacion Operacion)
    {
        List<VistaInmueble> inmueblesMostrar = new List<VistaInmueble>();

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
            bool mostrar = true;

            var localidad = Localidades.Where(t => t.LocalidadID == Inmueble.LocalidadID).SingleOrDefault();
            var provincia = Provincias.Where(t => t.ProvinciaID == localidad.ProvinciaID).SingleOrDefault();


            if (provinciaID != 0 && localidad.ProvinciaID != provinciaID)
            {
                mostrar = false;
            }

            if(Inmueble.Precio > precioMaximo || Inmueble.Precio < precioMinimo){
                mostrar = false;
            }
           
            if(Operacion != 0 && Operacion != Inmueble.TipoOperacion){
                mostrar = false;
            }


             if (TipoInmueble != null && TipoInmueble.Count > 0 && !TipoInmueble.Contains(Inmueble.TipoInmueble)){
                mostrar = false;
            }

            if (mostrar)
            {

                 // Obtener la imagen asociada al inmueble
            var imagen = Imagenes.FirstOrDefault(img => img.InmuebleID == Inmueble.InmuebleID);
            string imagenBase64 = imagen != null ? Convert.ToBase64String(imagen.ImagenByte) : null;
            string imagenSrc = imagen != null ? $"data:{imagen.ContentType};base64,{imagenBase64}" : "/path/to/default/image.jpg"; // Ruta a una imagen por defecto

            

                var localidadMostrar = new VistaInmueble
                {
                    InmuebleID = Inmueble.InmuebleID,
                    TituloString = Inmueble.Titulo,
                    ProvinciaString = provincia.Nombre,
                    LocalidadString = localidad.Nombre,
                    DireccionString = Inmueble.Direccion,
                    NroDireccionString = Inmueble.NroDireccion,
                    PrecioString = (float)Inmueble.Precio,
                    TipoOperacionString = Inmueble.TipoOperacion.ToString(),
                    ImagenSrc = imagenSrc // Añadir URL de la imagen
                };
                inmueblesMostrar.Add(localidadMostrar);
            }
        }

        return Json(inmueblesMostrar);
    }







    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
