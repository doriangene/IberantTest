using Microsoft.EntityFrameworkCore.Migrations;

namespace PackingListApp.Migrations
{
    public partial class RestrictAddress : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
             $"UPDATE UserModels SET Address = CAST(Address AS VARCHAR(10))");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
