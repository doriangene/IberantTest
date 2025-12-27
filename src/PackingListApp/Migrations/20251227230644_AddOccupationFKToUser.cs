using Microsoft.EntityFrameworkCore.Migrations;

namespace PackingListApp.Migrations
{
    public partial class AddOccupationFKToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OccupationId",
                table: "UserModels",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserModels_OccupationId",
                table: "UserModels",
                column: "OccupationId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserModels_OccupationModels_OccupationId",
                table: "UserModels",
                column: "OccupationId",
                principalTable: "OccupationModels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserModels_OccupationModels_OccupationId",
                table: "UserModels");

            migrationBuilder.DropIndex(
                name: "IX_UserModels_OccupationId",
                table: "UserModels");

            migrationBuilder.DropColumn(
                name: "OccupationId",
                table: "UserModels");
        }
    }
}
