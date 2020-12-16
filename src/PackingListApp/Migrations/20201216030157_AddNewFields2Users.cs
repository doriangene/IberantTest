using Microsoft.EntityFrameworkCore.Migrations;

namespace PackingListApp.Migrations
{
    public partial class AddNewFields2Users : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("update UserModels set Address = substring(Address, 1, 10)");
            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "UserModels",
                maxLength: 10,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AdminType",
                table: "UserModels",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsAdmin",
                table: "UserModels",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdminType",
                table: "UserModels");

            migrationBuilder.DropColumn(
                name: "IsAdmin",
                table: "UserModels");

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "UserModels",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
