using Microsoft.EntityFrameworkCore.Migrations;

namespace PackingListApp.Migrations
{
    public partial class Update_from_TestModel_to_OccupationModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TestModels");

            migrationBuilder.AddColumn<int>(
                name: "OccupationId",
                table: "UserModels",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "OccupationModels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OccupationModels", x => x.Id);
                });

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

            migrationBuilder.DropTable(
                name: "OccupationModels");

            migrationBuilder.DropIndex(
                name: "IX_UserModels_OccupationId",
                table: "UserModels");

            migrationBuilder.DropColumn(
                name: "OccupationId",
                table: "UserModels");

            migrationBuilder.CreateTable(
                name: "TestModels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestModels", x => x.Id);
                });
        }
    }
}
