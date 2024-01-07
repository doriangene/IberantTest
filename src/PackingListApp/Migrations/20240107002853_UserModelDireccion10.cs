using Microsoft.EntityFrameworkCore.Migrations;

namespace PackingListApp.Migrations
{
    public partial class UserModelDireccion10 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            
            migrationBuilder.Sql("UPDATE dbo.UsuarioModels SET Direccion = LEFT(Direccion, 10) WHERE LEN(Direccion) > 10");
            migrationBuilder.AlterColumn<string>(
                name: "Direccion",
                table: "UsuarioModels",
                type: "nvarchar(10)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(33)",
                oldMaxLength: 33,
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Direccion",
                table: "UsuarioModels",
                type: "nvarchar(33)",
                maxLength: 33,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(10)",
                oldNullable: true);
        }
    }
}
