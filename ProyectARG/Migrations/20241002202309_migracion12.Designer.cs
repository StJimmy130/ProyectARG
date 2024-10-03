﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ProyectARG.Data;

#nullable disable

namespace ProyectARG.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241002202309_migracion12")]
    partial class migracion12
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<string>("ProviderKey")
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<string>("Name")
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("ProyectARG.Models.Comentario", b =>
                {
                    b.Property<int>("ComentarioID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ComentarioID"));

                    b.Property<int?>("InmuebleID")
                        .HasColumnType("int");

                    b.Property<string>("Mensaje")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("UsuarioID")
                        .HasColumnType("int");

                    b.HasKey("ComentarioID");

                    b.HasIndex("InmuebleID");

                    b.HasIndex("UsuarioID");

                    b.ToTable("Comentarios");
                });

            modelBuilder.Entity("ProyectARG.Models.Imagen", b =>
                {
                    b.Property<int>("ImagenID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ImagenID"));

                    b.Property<string>("ContentType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte[]>("ImagenByte")
                        .HasColumnType("varbinary(max)");

                    b.Property<int>("InmuebleID")
                        .HasColumnType("int");

                    b.Property<string>("NombreArchivo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Posicion")
                        .HasColumnType("int");

                    b.Property<int?>("UsuarioID")
                        .HasColumnType("int");

                    b.HasKey("ImagenID");

                    b.HasIndex("InmuebleID");

                    b.ToTable("Imagenes");
                });

            modelBuilder.Entity("ProyectARG.Models.Inmueble", b =>
                {
                    b.Property<int>("InmuebleID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("InmuebleID"));

                    b.Property<bool>("Activo")
                        .HasColumnType("bit");

                    b.Property<bool>("Admin")
                        .HasColumnType("bit");

                    b.Property<bool>("Amoblado")
                        .HasColumnType("bit");

                    b.Property<int>("Banios")
                        .HasColumnType("int");

                    b.Property<string>("Barrio")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("CantidadAmbientes")
                        .HasColumnType("int");

                    b.Property<bool>("Cochera")
                        .HasColumnType("bit");

                    b.Property<string>("Descripcion")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Direccion")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Dormitorios")
                        .HasColumnType("int");

                    b.Property<DateTime>("FechaAlta")
                        .HasColumnType("datetime2");

                    b.Property<int>("LocalidadID")
                        .HasColumnType("int");

                    b.Property<bool>("Moneda")
                        .HasColumnType("bit");

                    b.Property<string>("NroDepartamento")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("NroDireccion")
                        .HasColumnType("int");

                    b.Property<int?>("Piso")
                        .HasColumnType("int");

                    b.Property<float?>("Precio")
                        .HasColumnType("real");

                    b.Property<int?>("SuperficieCubierta")
                        .HasColumnType("int");

                    b.Property<int?>("SuperficieTotal")
                        .HasColumnType("int");

                    b.Property<int>("TipoInmueble")
                        .HasColumnType("int");

                    b.Property<int>("TipoOperacion")
                        .HasColumnType("int");

                    b.Property<string>("Titulo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("UsuarioID")
                        .HasColumnType("int");

                    b.HasKey("InmuebleID");

                    b.HasIndex("LocalidadID");

                    b.HasIndex("UsuarioID");

                    b.ToTable("Inmuebles");
                });

            modelBuilder.Entity("ProyectARG.Models.Localidad", b =>
                {
                    b.Property<int>("LocalidadID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("LocalidadID"));

                    b.Property<string>("Nombre")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ProvinciaID")
                        .HasColumnType("int");

                    b.HasKey("LocalidadID");

                    b.HasIndex("ProvinciaID");

                    b.ToTable("Localidades");
                });

            modelBuilder.Entity("ProyectARG.Models.Provincia", b =>
                {
                    b.Property<int>("ProvinciaID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProvinciaID"));

                    b.Property<string>("Nombre")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ProvinciaID");

                    b.ToTable("Provincias");
                });

            modelBuilder.Entity("ProyectARG.Models.Usuario", b =>
                {
                    b.Property<int?>("UsuarioID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("UsuarioID"));

                    b.Property<string>("CuentaID")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Facebook")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Instagram")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("LocalidadID")
                        .HasColumnType("int");

                    b.Property<string>("Nombre")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("NroTelefono")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Whatsapp")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UsuarioID");

                    b.HasIndex("LocalidadID");

                    b.ToTable("Usuarios");
                });

            modelBuilder.Entity("ProyectARG.Models.Valoracion", b =>
                {
                    b.Property<int>("ValoracionID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ValoracionID"));

                    b.Property<int?>("InmuebleID")
                        .HasColumnType("int");

                    b.Property<int>("Puntuacion")
                        .HasColumnType("int");

                    b.Property<int?>("UsuarioID")
                        .HasColumnType("int");

                    b.HasKey("ValoracionID");

                    b.HasIndex("InmuebleID");

                    b.HasIndex("UsuarioID");

                    b.ToTable("Valoraciones");
                });

            modelBuilder.Entity("ProyectARG.Models.Vista", b =>
                {
                    b.Property<int>("VistaID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VistaID"));

                    b.Property<int>("InmuebleID")
                        .HasColumnType("int");

                    b.Property<int?>("UsuarioID")
                        .HasColumnType("int");

                    b.Property<DateTime>("VistaFecha")
                        .HasColumnType("datetime2");

                    b.HasKey("VistaID");

                    b.HasIndex("InmuebleID");

                    b.HasIndex("UsuarioID");

                    b.ToTable("Vistas");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ProyectARG.Models.Comentario", b =>
                {
                    b.HasOne("ProyectARG.Models.Inmueble", "Inmuebles")
                        .WithMany("Comentarios")
                        .HasForeignKey("InmuebleID");

                    b.HasOne("ProyectARG.Models.Usuario", "Usuarios")
                        .WithMany("Comentarios")
                        .HasForeignKey("UsuarioID");

                    b.Navigation("Inmuebles");

                    b.Navigation("Usuarios");
                });

            modelBuilder.Entity("ProyectARG.Models.Imagen", b =>
                {
                    b.HasOne("ProyectARG.Models.Inmueble", "Inmuebles")
                        .WithMany("Imagenes")
                        .HasForeignKey("InmuebleID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Inmuebles");
                });

            modelBuilder.Entity("ProyectARG.Models.Inmueble", b =>
                {
                    b.HasOne("ProyectARG.Models.Localidad", "Localidad")
                        .WithMany("Inmuebles")
                        .HasForeignKey("LocalidadID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ProyectARG.Models.Usuario", "Usuario")
                        .WithMany("Inmuebles")
                        .HasForeignKey("UsuarioID");

                    b.Navigation("Localidad");

                    b.Navigation("Usuario");
                });

            modelBuilder.Entity("ProyectARG.Models.Localidad", b =>
                {
                    b.HasOne("ProyectARG.Models.Provincia", "Provincias")
                        .WithMany("Localidades")
                        .HasForeignKey("ProvinciaID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Provincias");
                });

            modelBuilder.Entity("ProyectARG.Models.Usuario", b =>
                {
                    b.HasOne("ProyectARG.Models.Localidad", "Localidad")
                        .WithMany("Usuarios")
                        .HasForeignKey("LocalidadID");

                    b.Navigation("Localidad");
                });

            modelBuilder.Entity("ProyectARG.Models.Valoracion", b =>
                {
                    b.HasOne("ProyectARG.Models.Inmueble", "Inmuebles")
                        .WithMany("Valoraciones")
                        .HasForeignKey("InmuebleID");

                    b.HasOne("ProyectARG.Models.Usuario", "Usuarios")
                        .WithMany("Valoraciones")
                        .HasForeignKey("UsuarioID");

                    b.Navigation("Inmuebles");

                    b.Navigation("Usuarios");
                });

            modelBuilder.Entity("ProyectARG.Models.Vista", b =>
                {
                    b.HasOne("ProyectARG.Models.Inmueble", "Inmuebles")
                        .WithMany("Vistas")
                        .HasForeignKey("InmuebleID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ProyectARG.Models.Usuario", "Usuarios")
                        .WithMany()
                        .HasForeignKey("UsuarioID");

                    b.Navigation("Inmuebles");

                    b.Navigation("Usuarios");
                });

            modelBuilder.Entity("ProyectARG.Models.Inmueble", b =>
                {
                    b.Navigation("Comentarios");

                    b.Navigation("Imagenes");

                    b.Navigation("Valoraciones");

                    b.Navigation("Vistas");
                });

            modelBuilder.Entity("ProyectARG.Models.Localidad", b =>
                {
                    b.Navigation("Inmuebles");

                    b.Navigation("Usuarios");
                });

            modelBuilder.Entity("ProyectARG.Models.Provincia", b =>
                {
                    b.Navigation("Localidades");
                });

            modelBuilder.Entity("ProyectARG.Models.Usuario", b =>
                {
                    b.Navigation("Comentarios");

                    b.Navigation("Inmuebles");

                    b.Navigation("Valoraciones");
                });
#pragma warning restore 612, 618
        }
    }
}
