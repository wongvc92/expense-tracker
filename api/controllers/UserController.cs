
using api.interfaces;
using api.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController(IUserService userService) : ControllerBase
    {

        private readonly IUserService _userService = userService;

        [Authorize]
        [HttpGet]
        public async Task<ActionResult> GetUser()
        {
            var user = await _userService.GetAuthenticatedUserAsync(User);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(user.ToUserResponse());
        }
    }
}