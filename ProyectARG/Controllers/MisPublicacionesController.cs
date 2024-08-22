using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using ProyectARG.Data;
using ProyectARG.Models;

namespace ProyectARG.Controllers;

[Authorize]
public class MisPublicacionesController : Controller
{
    private ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public MisPublicacionesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index(int? UsuarioID)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        UsuarioID = _context.Usuarios
                .Where(t => t.CuentaID == userId)
                .Select(t => t.UsuarioID) // Proyecta solo el campo UsuarioID
                .SingleOrDefault();;

                ViewBag.UsuarioID = UsuarioID;
        return View();

    }

    private string SplitCamelCase(string input)
    {
        return System.Text.RegularExpressions.Regex.Replace(input, "(\\B[A-Z])", " $1");
    }

    public JsonResult GetPublicaciones(int UsuarioID, int InmuebleID)
    {
        List<VistaInmueble> inmueblesMostrar = new List<VistaInmueble>();

        var Inmuebles = _context.Inmuebles.ToList();
        var Imagenes = _context.Imagenes.ToList();

        if (UsuarioID != 0)
        {
            Inmuebles = Inmuebles.Where(t => t.UsuarioID == UsuarioID).ToList();
        }

        if (InmuebleID != 0){
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



            var localidadMostrar = new VistaInmueble
            {
                InmuebleID = Inmueble.InmuebleID,
                TituloString = Inmueble.Titulo,
                ProvinciaString = provincia.Nombre,
                LocalidadString = localidad.Nombre,
                DireccionString = Inmueble.Direccion,
                DescripcionString = Inmueble.Descripcion,
                NroDireccionString = Inmueble.NroDireccion,
                PrecioString = (float)Inmueble.Precio,
                TipoOperacionString = SplitCamelCase(Inmueble.TipoOperacion.ToString()),
                Imagenes = imagenesBase64 // Usar la lista de ImagenVista
            };
            inmueblesMostrar.Add(localidadMostrar);
        }
        return Json(inmueblesMostrar);
    }






}