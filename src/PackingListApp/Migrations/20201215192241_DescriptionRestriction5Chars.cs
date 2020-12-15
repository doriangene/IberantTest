using Microsoft.EntityFrameworkCore.Migrations;

namespace PackingListApp.Migrations
{
    public partial class DescriptionRestriction5Chars : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "MyUsers",
                maxLength: 5,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 10,
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "MyUsers",
                maxLength: 10,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 5,
                oldNullable: true);
        }
    }
}
