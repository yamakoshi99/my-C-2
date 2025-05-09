using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using my_C_2.Models;

namespace my_C_2.Controllers;

public class Quiz : Controller
{
    private readonly ILogger<Quiz> _logger;

    public Quiz(ILogger<Quiz> logger)
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
