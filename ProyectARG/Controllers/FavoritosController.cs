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
            return Json(new { success = true, message = "Favorito agregado", isFavorito = true });
            
        }
        else
        {
            // Si existe, lo eliminamos
            _context.Favoritos.Remove(favorito);
            _context.SaveChanges();
            return Json(new { success = true, message = "Favorito eliminado", isFavorito = false });
            
        }

        

        
    }
}

