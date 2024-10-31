using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectARG.Models;
using ProyectARG.Data;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Security.Claims;
using System.Text.RegularExpressions;

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
                .SingleOrDefault(); 

        ViewBag.UsuarioID = UsuarioID;
        return View();
    }

    public JsonResult GetInformacion(int UsuarioID)
    {
        var perfil = _context.Usuarios.Where(t => t.UsuarioID == UsuarioID).SingleOrDefault();
        return Json(perfil);
    }





    public string LimpiarTelefono(string telefonoConFormato)
    {
        // Eliminar todos los caracteres que no sean números
        return Regex.Replace(telefonoConFormato, @"\D", "");
    }


    public JsonResult UpdateInformacion(int? UsuarioID, string Nombre, string? NroTelefono, string? Email, string? Instagram, string? Facebook, string? Whatsapp)
    {
        string resultado = "";
        if (Nombre != null)
        {
            var Usuario = _context.Usuarios.Find(UsuarioID);
            if (Usuario != null)
            {
                // Limpiar los números de teléfono y whatsapp
                if (!string.IsNullOrEmpty(NroTelefono))
                {
                    NroTelefono = LimpiarTelefono(NroTelefono);
                }

                if (!string.IsNullOrEmpty(Whatsapp))
                {
                    Whatsapp = LimpiarTelefono(Whatsapp);
                }

                // Actualizar los campos del usuario
                Usuario.Nombre = Nombre;
                Usuario.NroTelefono = NroTelefono;
                Usuario.Instagram = Instagram;
                Usuario.Facebook = Facebook;
                Usuario.Whatsapp = Whatsapp;

                // Guardar los cambios
                _context.SaveChanges();

                resultado = "Información actualizada con éxito";
            }
            else
            {
                resultado = "Usuario no encontrado";
            }
        }
        else
        {
            resultado = "El campo nombre es obligatorio";
        }

        return Json(resultado);
    }
}