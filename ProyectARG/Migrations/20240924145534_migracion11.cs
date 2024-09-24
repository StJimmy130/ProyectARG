using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectARG.Migrations
{
    /// <inheritdoc />
    public partial class migracion11 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vistas_Usuarios_usuarioID",
                table: "Vistas");

            migrationBuilder.RenameColumn(
                name: "vistaFecha",
                table: "Vistas",
                newName: "VistaFecha");

            migrationBuilder.RenameColumn(
                name: "usuarioID",
                table: "Vistas",
                newName: "UsuarioID");

            migrationBuilder.RenameColumn(
                name: "vistaID",
                table: "Vistas",
                newName: "VistaID");

            migrationBuilder.RenameIndex(
                name: "IX_Vistas_usuarioID",
                table: "Vistas",
                newName: "IX_Vistas_UsuarioID");

            migrationBuilder.AlterColumn<int>(
                name: "UsuarioID",
                table: "Vistas",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Vistas_Usuarios_UsuarioID",
                table: "Vistas",
                column: "UsuarioID",
                principalTable: "Usuarios",
                principalColumn: "UsuarioID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vistas_Usuarios_UsuarioID",
                table: "Vistas");

            migrationBuilder.RenameColumn(
                name: "VistaFecha",
                table: "Vistas",
                newName: "vistaFecha");

            migrationBuilder.RenameColumn(
                name: "UsuarioID",
                table: "Vistas",
                newName: "usuarioID");

            migrationBuilder.RenameColumn(
                name: "VistaID",
                table: "Vistas",
                newName: "vistaID");

            migrationBuilder.RenameIndex(
                name: "IX_Vistas_UsuarioID",
                table: "Vistas",
                newName: "IX_Vistas_usuarioID");

            migrationBuilder.AlterColumn<int>(
                name: "usuarioID",
                table: "Vistas",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Vistas_Usuarios_usuarioID",
                table: "Vistas",
                column: "usuarioID",
                principalTable: "Usuarios",
                principalColumn: "UsuarioID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
