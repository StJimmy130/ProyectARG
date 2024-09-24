using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectARG.Migrations
{
    /// <inheritdoc />
    public partial class migracion10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Posicion",
                table: "Imagenes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Vistas",
                columns: table => new
                {
                    vistaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuarioID = table.Column<int>(type: "int", nullable: false),
                    InmuebleID = table.Column<int>(type: "int", nullable: false),
                    vistaFecha = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vistas", x => x.vistaID);
                    table.ForeignKey(
                        name: "FK_Vistas_Inmuebles_InmuebleID",
                        column: x => x.InmuebleID,
                        principalTable: "Inmuebles",
                        principalColumn: "InmuebleID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Vistas_Usuarios_usuarioID",
                        column: x => x.usuarioID,
                        principalTable: "Usuarios",
                        principalColumn: "UsuarioID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Vistas_InmuebleID",
                table: "Vistas",
                column: "InmuebleID");

            migrationBuilder.CreateIndex(
                name: "IX_Vistas_usuarioID",
                table: "Vistas",
                column: "usuarioID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Vistas");

            migrationBuilder.DropColumn(
                name: "Posicion",
                table: "Imagenes");
        }
    }
}
