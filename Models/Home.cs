namespace my_C_2.Models;

public class Book
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Author { get; set; }
    public string Publisher { get; set; }
    public DateTime PublishedDate { get; set; }
    public string ISBN { get; set; }
    public int Pages { get; set; }
    public string Language { get; set; }
}