using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ProyectARG.Data;
using ProyectARG.Models;

namespace ProyectARG.Controllers;

[Authorize]
public class FavoritosController : Controller
{
    private ApplicationDbContext _context;



    public FavoritosController(ApplicationDbContext context)
    {
        _context = context;
    }


    public IActionResult Index(int? UsuarioID)
    {

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

public JsonResult ListadoFavoritos(int usuarioID)
{
    List<VistaInmueble> inmueblesMostrar = new List<VistaInmueble>();

    // Obtener solo los inmuebles activos que están en los favoritos del usuario
    var favoritos = _context.Favoritos
                            .Where(f => f.UsuarioID == usuarioID)
                            .Select(f => f.InmuebleID)
                            .ToList();

    // Filtrar los inmuebles que están activos y en la lista de favoritos
    var inmueblesQuery = _context.Inmuebles
                                 .Where(i => i.Activo && favoritos.Contains(i.InmuebleID))
                                 .OrderByDescending(i => i.FechaAlta)
                                 .ToList();

    var provincias = _context.Provincias.ToList();
    var localidades = _context.Localidades.ToList();
    var imagenes = _context.Imagenes.ToList(); // Traer todas las imágenes

    foreach (var inmueble in inmueblesQuery)
    {
        var localidad = localidades.SingleOrDefault(t => t.LocalidadID == inmueble.LocalidadID);
        var provincia = provincias.SingleOrDefault(t => t.ProvinciaID == localidad?.ProvinciaID);
        var favorito = _context.Favoritos.Where(f => f.InmuebleID == inmueble.InmuebleID && f.UsuarioID == usuarioID).ToList().Count > 0;

        // Obtener la imagen asociada al inmueble
        var imagen = imagenes.OrderBy(img => img.Posicion).FirstOrDefault(img => img.InmuebleID == inmueble.InmuebleID);
        string imagenBase64 = imagen != null ? Convert.ToBase64String(imagen.ImagenByte) : null;
        string imagenSrc = imagen != null ? $"data:{imagen.ContentType};base64,{imagenBase64}" : "/path/to/default/image.jpg"; // Ruta a una imagen por defecto

        var inmuebleMostrar = new VistaInmueble
        {
            InmuebleID = inmueble.InmuebleID,
            TituloString = inmueble.Titulo,
            ProvinciaString = provincia?.Nombre,
            LocalidadString = localidad?.Nombre,
            DireccionString = inmueble.Direccion,
            NroDireccionString = inmueble.NroDireccion,
            PrecioString = inmueble.Precio.ToString(),
            TipoOperacionString = SplitCamelCase(inmueble.TipoOperacion.ToString()),
            Moneda = inmueble.Moneda,
            ImagenSrc = imagenSrc,
            EsFavorito = favorito // Esto indica que es un favorito
        };
        inmueblesMostrar.Add(inmuebleMostrar);
    }

    return Json(inmueblesMostrar);
}


    public JsonResult ToggleFavorito(int inmuebleId, int usuarioId)
    {
        if (usuarioId == 0)
        {
            return Json(new { message = "Usuario no autorizado" });
        }


        var favorito = _context.Favoritos
            .FirstOrDefault(f => f.UsuarioID == usuarioId && f.InmuebleID == inmuebleId);

        if (favorito == null)
        {
            // Si no existe, lo creamos
            favorito = new Favorito
            {
                UsuarioID = usuarioId,
                InmuebleID = inmuebleId,
                FechaAgregado = DateTime.Now
            };
            _context.Favoritos.Add(favorito);
            _context.SaveChanges();
            return Json(new { success = true, message = "Favorito agregado", esFavorito = true });

        }
        else
        {
            // Si existe, lo eliminamos
            _context.Favoritos.Remove(favorito);
            _context.SaveChanges();
            return Json(new { success = true, message = "Favorito eliminado", esFavorito = false });

        }




    }
}

