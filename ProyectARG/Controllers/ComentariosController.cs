using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using ProyectARG.Data;
using ProyectARG.Models;

namespace ProyectARG.Controllers;

[Authorize]
public class ComentariosController : Controller
{
    private ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public ComentariosController(ApplicationDbContext context)
    {
        _context = context;
    }

    public JsonResult GetComentarios(int InmuebleID)
    {
        List<VistaComentario> ComentariosList = new List<VistaComentario>();
        var comentarios = _context.Comentarios.Where(t => t.InmuebleID == InmuebleID).ToList();
        var usuarios = _context.Usuarios.ToList(); // Buscamos los usuarios correspondientes

        foreach (var comentario in comentarios){
            var usuario = _context.Usuarios.Find(comentario.UsuarioID);

        var comentarioMostrar = new VistaComentario
        {
            ComentarioID = comentario.ComentarioID,
            Mensaje = comentario.Mensaje,
            NombreUsuario = usuario.Nombre
        };

        ComentariosList.Add(comentarioMostrar);
        }

        return Json(ComentariosList);
    }

    public JsonResult PostComentario(int ComentarioID, int InmuebleID, int UsuarioID, string Mensaje)
    {
        string Result = "";
        if (ComentarioID == 0)
        {
            var Comentarios = new Comentario
            {
                InmuebleID = InmuebleID,
                UsuarioID = UsuarioID,
                Mensaje = Mensaje
            };
            _context.Add(Comentarios);
            _context.SaveChanges();
            Result = "Comentario Creado";
        }
        else
        {
            var Comentarios = _context.Comentarios.Find(ComentarioID);
            Comentarios.Mensaje = Mensaje;
            _context.SaveChanges();
            Result = "Comentario Actualizado";
        }
        return Json(Result);
    }

    public JsonResult PostValoracion(int ComentarioID, int InmuebleID, int UsuarioID, int Puntuacion)
    {
        string Result = "";
        var valoracion = _context.Valoraciones.Where(t => t.InmuebleID == InmuebleID && t.UsuarioID == UsuarioID).FirstOrDefault();
        if (valoracion != null)
        {
            var Valoracion = new Valoracion
            {
                InmuebleID = InmuebleID,
                UsuarioID = UsuarioID,
                Puntuacion = Puntuacion
            };
            _context.Add(Valoracion);
            _context.SaveChanges();
            Result = "Valoracion hecha";
        }
        else
        {

            valoracion.Puntuacion = Puntuacion;
            _context.SaveChanges();
            Result = "Valoracion actualizada";
        }
        return Json(Result);
    }

}

