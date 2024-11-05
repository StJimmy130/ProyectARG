using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProyectARG.Migrations
{
    /// <inheritdoc />
    public partial class Migracion13 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "Precio",
                table: "Inmuebles",
                type: "real",
                nullable: false,
                defaultValue: 0f,
                oldClrType: typeof(float),
                oldType: "real",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "Precio",
                table: "Inmuebles",
                type: "real",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "real");
        }
    }
}
