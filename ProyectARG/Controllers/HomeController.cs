using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectARG.Models;
using ProyectARG.Data;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ProyectARG.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    private ApplicationDbContext _context;

    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _rolManager;

    public HomeController(ILogger<HomeController> logger, ApplicationDbContext context, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> rolManager)
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
        _rolManager = rolManager;
    }


    public async Task<IActionResult> Index(int? UsuarioID)
    {
        var localidades = _context.Localidades.ToList();
        var provincias = _context.Provincias.ToList();

        
            var selectListItemsOperacion = new List<SelectListItem>
    {
        new SelectListItem { Value = "0", Text = "[SELECCIONE...]" }
    };

            var enumValuesOperacion = Enum.GetValues(typeof(Operacion)).Cast<Operacion>();

            foreach (var value in enumValuesOperacion)
            {
                selectListItemsOperacion.Add(new SelectListItem
                {
                    Value = ((int)value).ToString(),
                    Text = SplitCamelCase(value.ToString())
                });
            }


            provincias.Add(new Provincia { ProvinciaID = 0, Nombre = "[SELECCIONE...]" });
            ViewBag.ProvinciaID = new SelectList(provincias.OrderBy(c => c.Nombre), "ProvinciaID", "Nombre");

            localidades.Add(new Localidad { LocalidadID = 0, Nombre = "[SELECCIONE...]" });
            ViewBag.LocalidadID = new SelectList(localidades.OrderBy(c => c.Nombre), "LocalidadID", "Nombre");

            
        
        await InicializarPermisosUsuario();

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

    // Obtener solo los inmuebles activos
    var inmueblesQuery = _context.Inmuebles.Where(i => i.Activo == true).AsQueryable();
    var imagenes = _context.Imagenes.ToList(); // Traer todas las imágenes

    // Aplicar filtros
    if (localidadID != 0)
    {
        inmueblesQuery = inmueblesQuery.Where(t => t.LocalidadID == localidadID);
    }

    if (InmuebleID != 0)
    {
        inmueblesQuery = inmueblesQuery.Where(t => t.InmuebleID == InmuebleID);
    }

    // Filtrar por precio
    if (precioMaximo.HasValue && precioMaximo.Value > 0)
    {
        inmueblesQuery = inmueblesQuery.Where(i => i.Precio <= precioMaximo);
    }

    if (precioMinimo.HasValue && precioMinimo.Value > 0)
    {
        inmueblesQuery = inmueblesQuery.Where(i => i.Precio >= precioMinimo);
    }

    // Filtrar por operación
    if (Operacion != 0)
    {
        inmueblesQuery = inmueblesQuery.Where(i => i.TipoOperacion == Operacion);
    }

    // Filtrar por provincia
    if (provinciaID != 0)
    {
        inmueblesQuery = inmueblesQuery.Where(i => i.Localidad.ProvinciaID == provinciaID); // Asegúrate de que Localidad esté cargado
    }

    // Filtrar por tipo de inmueble
    if (TipoInmueble != null && TipoInmueble.Count > 0)
    {
        inmueblesQuery = inmueblesQuery.Where(i => TipoInmueble.Contains(i.TipoInmueble));
    }

    // Ordenar después de aplicar todos los filtros
    var inmuebles = inmueblesQuery.OrderByDescending(i => i.FechaAlta).ToList();
    var provincias = _context.Provincias.ToList();
    var localidades = _context.Localidades.ToList();

    foreach (var inmueble in inmuebles)
    {
        var localidad = localidades.SingleOrDefault(t => t.LocalidadID == inmueble.LocalidadID);
        var provincia = provincias.SingleOrDefault(t => t.ProvinciaID == localidad?.ProvinciaID);

        // Obtener la imagen asociada al inmueble
        var imagen = imagenes.OrderBy(img => img.Posicion).FirstOrDefault(img => img.InmuebleID == inmueble.InmuebleID);
        string imagenBase64 = imagen != null ? Convert.ToBase64String(imagen.ImagenByte) : null;
        string imagenSrc = imagen != null ? $"data:{imagen.ContentType};base64,{imagenBase64}" : "/path/to/default/image.jpg"; // Ruta a una imagen por defecto

        var localidadMostrar = new VistaInmueble
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
            ImagenSrc = imagenSrc // Añadir URL de la imagen
        };
        inmueblesMostrar.Add(localidadMostrar);
    }

    return Json(inmueblesMostrar);
}


public async Task<JsonResult> InicializarPermisosUsuario()
{
    // CREAR ROLES SI NO EXISTEN
    // Se verifica si el rol "ADMINISTRADOR" ya existe en la base de datos.
    var nombreRolCrearExiste = _context.Roles.Where(r => r.Name == "ADMINISTRADOR").SingleOrDefault();
    
    // Si el rol "ADMINISTRADOR" no existe, se crea un nuevo rol con ese nombre.
    if (nombreRolCrearExiste == null)
    {
        var roleResult = await _rolManager.CreateAsync(new IdentityRole("ADMINISTRADOR"));
    }

    // CREAR USUARIO PRINCIPAL
    // Esta variable indica si el usuario fue creado exitosamente.
    bool creado = false;
    
    // BUSCAR POR MEDIO DE CORREO ELECTRONICO SI EXISTE EL USUARIO
    // Se busca en la base de datos si ya existe un usuario con el correo "admin@sistema.com".
    var usuario = _context.Users.Where(u => u.Email == "admin@proyectarg.com").SingleOrDefault();
    
    // Si no existe un usuario con ese correo, se procede a crearlo.
    if (usuario == null)
    {
        // Se crea un nuevo usuario con el correo "admin@proyectarg.com" y el nombre "Admin"
        var user = new IdentityUser { UserName = "admin@proyectarg.com", Email = "admin@proyectarg.com" };
        
        // Se guarda el usuario en la base de datos con la contraseña predeterminada "ProyectARG2024".
        var result = await _userManager.CreateAsync(user, "ProyectARG2024");

        // Se asigna el rol "ADMINISTRADOR" al nuevo usuario creado.
        await _userManager.AddToRoleAsync(user, "ADMINISTRADOR");

        // Se actualiza la variable "creado" para indicar si la creación fue exitosa.
        creado = result.Succeeded;
    }

    // CODIGO PARA BUSCAR EL USUARIO EN CASO DE NECESITARLO
    // Se vuelve a buscar el usuario "admin@proyectarg.com" en la base de datos, en caso de necesitar su ID.
    var superusuario = _context.Users.Where(r => r.Email == "admin@proyectarg.com").SingleOrDefault();
    if (superusuario != null)
    {
        // Aquí se obtiene el ID del usuario encontrado.
        var usuarioID = superusuario.Id;
    }

    // Devuelve un objeto JSON que indica si el usuario fue creado.
    return Json(creado);
}

    public JsonResult CheckSocialMedia(int? UsuarioID)
    {
        var socialMedia = _context.Usuarios.Where(t => t.UsuarioID == UsuarioID).SingleOrDefault();
        string resultado = "";

        if (socialMedia.Instagram == null && socialMedia.Facebook == null && socialMedia.Whatsapp == null){
            resultado = "Para poder publicar recuerda que debes agregar al menos una de tus redes sociales";
        }

        return Json(resultado);
    }


    [Authorize(Roles = "ADMINISTRADOR")]
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
