using Microsoft.EntityFrameworkCore.Migrations;

namespace PackingListApp.Migrations
{
    public partial class AddIberantUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql($"INSERT INTO UserModels(Name, LastName, Address) VALUES(N'Iberant', N'Iberant', N'This is a text with 33 characters')");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}