using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Asegúrate de tener este using
using ProyectARG.Data; // Asegúrate de usar el namespace de tu DbContext

public class MigracionController : Controller
{
    private readonly ApplicationDbContext _context;

    public MigracionController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult RunMigrations()
    {
        // Aplica las migraciones pendientes
        _context.Database.Migrate();

        return Content("Migraciones ejecutadas correctamente.");
    }
}