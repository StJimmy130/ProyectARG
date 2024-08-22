using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectARG.Migrations
{
    /// <inheritdoc />
    public partial class migracion4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Localidades_LocalidadID",
                table: "Usuarios");

            migrationBuilder.AlterColumn<int>(
                name: "LocalidadID",
                table: "Usuarios",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Localidades_LocalidadID",
                table: "Usuarios",
                column: "LocalidadID",
                principalTable: "Localidades",
                principalColumn: "LocalidadID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Localidades_LocalidadID",
                table: "Usuarios");

            migrationBuilder.AlterColumn<int>(
                name: "LocalidadID",
                table: "Usuarios",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Localidades_LocalidadID",
                table: "Usuarios",
                column: "LocalidadID",
                principalTable: "Localidades",
                principalColumn: "LocalidadID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
