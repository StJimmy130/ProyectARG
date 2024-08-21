using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProyectARG.Models;
using ProyectARG.Data;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

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


    public async Task<IActionResult> Index()
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

            if (Inmueble.Precio > precioMaximo || Inmueble.Precio < precioMinimo)
            {
                mostrar = false;
            }

            if(precioMaximo == 0 && precioMinimo == 0){
                mostrar = true;
            }

            if (Operacion != 0 && Operacion != Inmueble.TipoOperacion)
            {
                mostrar = false;
            }


            if (TipoInmueble != null && TipoInmueble.Count > 0 && !TipoInmueble.Contains(Inmueble.TipoInmueble))
            {
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
                    TipoOperacionString = SplitCamelCase(Inmueble.TipoOperacion.ToString()),
                    ImagenSrc = imagenSrc // Añadir URL de la imagen
                };
                inmueblesMostrar.Add(localidadMostrar);
            }
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
