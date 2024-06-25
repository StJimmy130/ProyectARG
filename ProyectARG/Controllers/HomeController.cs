using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectARG.Models;
using ProyectARG.Data;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.AspNetCore.Authorization;
using Microsoft.CodeAnalysis.Elfie.Diagnostics;

namespace ProyectARG.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    private  ApplicationDbContext _context;

    public HomeController(ApplicationDbContext context, ILogger<HomeController> logger)
    {
        _logger = logger;
        _context = context;
    }


    public IActionResult Index()
    {
        return View();
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
