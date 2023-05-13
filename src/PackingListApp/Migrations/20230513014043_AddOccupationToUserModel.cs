using Microsoft.EntityFrameworkCore.Migrations;

namespace PackingListApp.Migrations
{
    public partial class AddOccupationToUserModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OccupationId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_OccupationId",
                table: "Users",
                column: "OccupationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_TestModels_OccupationId",
                table: "Users",
                column: "OccupationId",
                principalTable: "TestModels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_TestModels_OccupationId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_OccupationId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "OccupationId",
                table: "Users");
        }
    }
}
