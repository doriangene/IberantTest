using Microsoft.EntityFrameworkCore.Migrations;

namespace PackingListApp.Migrations
{
    public partial class AddOccupationForUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OccupationModelId",
                table: "UserModels",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserModels_OccupationModelId",
                table: "UserModels",
                column: "OccupationModelId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserModels_OccupationModels_OccupationModelId",
                table: "UserModels",
                column: "OccupationModelId",
                principalTable: "OccupationModels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserModels_OccupationModels_OccupationModelId",
                table: "UserModels");

            migrationBuilder.DropIndex(
                name: "IX_UserModels_OccupationModelId",
                table: "UserModels");

            migrationBuilder.DropColumn(
                name: "OccupationModelId",
                table: "UserModels");
        }
    }
}
