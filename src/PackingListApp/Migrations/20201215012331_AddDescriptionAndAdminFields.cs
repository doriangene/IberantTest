using Microsoft.EntityFrameworkCore.Migrations;

namespace PackingListApp.Migrations
{
    public partial class AddDescriptionAndAdminFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AdminType",
                table: "UserModels",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "UserModels",
                nullable: true);

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
                name: "Description",
                table: "UserModels");

            migrationBuilder.DropColumn(
                name: "IsAdmin",
                table: "UserModels");
        }
    }
}
