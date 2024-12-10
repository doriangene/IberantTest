using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using PackingList.Core.Queries;
using PackingListApp.Controllers;
using PackingListApp.Models;
using PackingListApp.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PackingListApp.Tests
{
    [TestFixture]
    public class UserControllerTests : GlobalFixture
    {
        private UserController _userController;
        private OccupationController _occupationController;

        [SetUp]
        public void SetUp()
        {
            var userService = new UserServices(_context);
            _userController = new UserController(userService);

            var occupationService = new OccupationServices(_context);
            _occupationController = new OccupationController(occupationService);
        }

        [Test]
        public async Task Post_AddNewUser()
        {
            var newOccupation = new NewOccupation { Title="Ciber", Description="uh"};

            _occupationController.Post(newOccupation);

            var newUser = new UserAddInput { Name = "Test", LastName = "Perez", Address = "asdasd", OccupationId=1 };

            var response = (OkObjectResult)await _userController.Post(newUser);
            var isSuccess = (response.Value as CommandHandledResult).IsSuccess;

            Assert.That(response.StatusCode, Is.EqualTo(200));
            Assert.That(isSuccess, Is.True);
        }

        [Test]
        public async Task Get_ReturnsAllUsers()
        {
            var usersList = new List<UserAddInput> { 
                new UserAddInput { Name = "test_name_1", LastName = "test_last_name_1", Address = "test_address_1" }, 
                new UserAddInput { Name = "test_name_2", LastName = "test_last_name_2", Address = "test_address_2" } };

            foreach (var newUser in usersList)
                await _userController.Post(newUser);
            
            var response = (OkObjectResult)await _userController.Get(null);
            List<User> currentList = (List<User>)(response.Value as QueryResult<User>).Items;
            
            Assert.That(response.StatusCode, Is.EqualTo(200));
            Assert.That(currentList.Count, Is.EqualTo(2));
        }

        [Test]
        public async Task Get_ReturnsSingleUser()
        {
            var newUser = new UserAddInput { Name = "Test", LastName = "Perez", Address = "asdasd" };
            await _userController.Post(newUser);

            var response = (OkObjectResult)await _userController.Get(1);

            Assert.That(response.StatusCode, Is.EqualTo(200));
        }

        [Test]
        public async Task Put_UpdatesExistingTest()
        {
            var newUser = new UserAddInput { Name = "test_name", LastName = "test_last_name", Address = "test_address" };
            await _userController.Post(newUser);

            var updateData = new UserUpdateInput { Name = "updated_name" };

            await _userController.Put(1, updateData);

            var response = (OkObjectResult)await _userController.Get(1);

            var responseData = (response.Value as User);


            Assert.That(response.StatusCode, Is.EqualTo(200));
            Assert.That(responseData.Name, Is.EqualTo("updated_name"));
        }
        
        [Test]
        public async Task Delete_ExistingUserTest()
        {
            var newUser = new UserAddInput { Name = "test_name", LastName = "test_last_name", Address = "test_address" };
            await _userController.Post(newUser);

            await _userController.Delete(1);

            var response = (OkObjectResult)await _userController.Get(1);

            Assert.That(response.StatusCode, Is.EqualTo(200));
            Assert.That(response.Value, Is.Null);
        }

    }
}
