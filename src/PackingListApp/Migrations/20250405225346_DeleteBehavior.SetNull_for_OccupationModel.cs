using Microsoft.EntityFrameworkCore.Migrations;

namespace PackingListApp.Migrations
{
    public partial class DeleteBehaviorSetNull_for_OccupationModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserModels_OccupationModels_OccupationModelId",
                table: "UserModels");

            migrationBuilder.AddForeignKey(
                name: "FK_UserModels_OccupationModels_OccupationModelId",
                table: "UserModels",
                column: "OccupationModelId",
                principalTable: "OccupationModels",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserModels_OccupationModels_OccupationModelId",
                table: "UserModels");

            migrationBuilder.AddForeignKey(
                name: "FK_UserModels_OccupationModels_OccupationModelId",
                table: "UserModels",
                column: "OccupationModelId",
                principalTable: "OccupationModels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
