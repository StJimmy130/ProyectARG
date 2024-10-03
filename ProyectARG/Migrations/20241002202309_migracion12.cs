using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectARG.Migrations
{
    /// <inheritdoc />
    public partial class migracion12 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Imagenes_Usuarios_UsuarioID",
                table: "Imagenes");

            migrationBuilder.DropIndex(
                name: "IX_Imagenes_UsuarioID",
                table: "Imagenes");

            migrationBuilder.DropColumn(
                name: "Comentario",
                table: "Valoraciones");

            migrationBuilder.CreateTable(
                name: "Comentarios",
                columns: table => new
                {
                    ComentarioID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Mensaje = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UsuarioID = table.Column<int>(type: "int", nullable: true),
                    InmuebleID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comentarios", x => x.ComentarioID);
                    table.ForeignKey(
                        name: "FK_Comentarios_Inmuebles_InmuebleID",
                        column: x => x.InmuebleID,
                        principalTable: "Inmuebles",
                        principalColumn: "InmuebleID");
                    table.ForeignKey(
                        name: "FK_Comentarios_Usuarios_UsuarioID",
                        column: x => x.UsuarioID,
                        principalTable: "Usuarios",
                        principalColumn: "UsuarioID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Comentarios_InmuebleID",
                table: "Comentarios",
                column: "InmuebleID");

            migrationBuilder.CreateIndex(
                name: "IX_Comentarios_UsuarioID",
                table: "Comentarios",
                column: "UsuarioID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comentarios");

            migrationBuilder.AddColumn<string>(
                name: "Comentario",
                table: "Valoraciones",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Imagenes_UsuarioID",
                table: "Imagenes",
                column: "UsuarioID");

            migrationBuilder.AddForeignKey(
                name: "FK_Imagenes_Usuarios_UsuarioID",
                table: "Imagenes",
                column: "UsuarioID",
                principalTable: "Usuarios",
                principalColumn: "UsuarioID");
        }
    }
}
