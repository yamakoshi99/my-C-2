using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using my_C_2.Models;

namespace my_C_2.Controllers;

public class MiniGame2 : Controller
{
    private readonly ILogger<MiniGame2> _logger;

    public MiniGame2(ILogger<MiniGame2> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]


    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
