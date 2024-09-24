using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProyectARG.Models;

namespace ProyectARG.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Valoracion> Valoraciones { get; set; }
    public DbSet<Inmueble> Inmuebles { get; set; }
    public DbSet<Localidad> Localidades { get; set; }
    public DbSet<Imagen> Imagenes { get; set; }    
    public DbSet<Provincia> Provincias { get; set; }
    public DbSet<Vista> Vistas { get; set; }

}
