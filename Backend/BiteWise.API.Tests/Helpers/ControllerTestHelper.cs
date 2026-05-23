using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BiteWise.API.Tests.Helpers
{
    public static class ControllerTestHelper
    {
        public static void SetupControllerContext(ControllerBase controller, Guid userId)
        {
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString())
            }, "mock"));

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }
    }
}
