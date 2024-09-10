using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectARG.Models;
using ProyectARG.Data;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Security.Claims;

namespace ProyectARG.Controllers;


public class PerfilesController : Controller
{
    private ApplicationDbContext _context;

    public PerfilesController(ApplicationDbContext context)
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

    public JsonResult GetInformacion(int UsuarioID)
    {
        var perfil = _context.Usuarios.Where(t => t.UsuarioID == UsuarioID).SingleOrDefault();
        return Json(perfil);
    }

    public JsonResult UpdateInformacion(int? UsuarioID, string Nombre, string? NroTelefono, string? Email, string? Instagram, string? Facebook, string? Whatsapp)
    {
        string resultado = "";
        if (Nombre != null)
        {
            var Usuario = _context.Usuarios.Find(UsuarioID);
            if (Usuario != null)
            {

                Usuario.Nombre = Nombre;
                Usuario.NroTelefono = NroTelefono;
                Usuario.Instagram = Instagram;
                Usuario.Facebook = Facebook;
                Usuario.Whatsapp = Whatsapp;

                _context.SaveChanges();
            }

            resultado = "Informacion actualizada con exito";

        }
        else
        {
            resultado = "El campo nombre es obligatorio";
        }
        return Json(resultado);
    }
    
}