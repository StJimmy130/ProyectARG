using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectARG.Migrations
{
    /// <inheritdoc />
    public partial class migracion2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Barrio",
                table: "Inmuebles",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "NroDepartamento",
                table: "Inmuebles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Piso",
                table: "Inmuebles",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NroDepartamento",
                table: "Inmuebles");

            migrationBuilder.DropColumn(
                name: "Piso",
                table: "Inmuebles");

            migrationBuilder.AlterColumn<string>(
                name: "Barrio",
                table: "Inmuebles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
