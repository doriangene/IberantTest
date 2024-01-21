using Microsoft.EntityFrameworkCore.Migrations;

namespace PackingListApp.Migrations
{
    public partial class AddIberantuser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql($"INSERT INTO UserModels(Name, LastName, Direction, IsAdmin, AdminType) VALUES(N'Iberant', N'Iberant', N'Adding Iberant user in UserModels', N'0', N'0')");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
