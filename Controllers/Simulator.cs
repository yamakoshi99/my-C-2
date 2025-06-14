using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using my_C_2.Models;

namespace my_C_2.Controllers;

public class Simulator : Controller
{
    private readonly ILogger<Simulator> _logger;

    public Simulator(ILogger<Simulator> logger)
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
