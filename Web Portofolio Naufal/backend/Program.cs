// ==============================================================================
// ASP.NET Core Minimal API Backend - Muhammad Naufal
// ==============================================================================
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();
app.UseCors();

var dataDir = Path.Combine(app.Environment.ContentRootPath, "..", "data");
var musicFile = Path.Combine(dataDir, "music.json");
var messagesFile = Path.Combine(dataDir, "messages.json");
var recsFile = Path.Combine(dataDir, "recommendations.json");

app.MapGet("/", () => Results.Ok(new { message = "Portfolio API Muhammad Naufal is running!", version = "2.0" }));

// GET /api/music
app.MapGet("/api/music", () =>
{
    if (!File.Exists(musicFile)) return Results.NotFound();
    var json = File.ReadAllText(musicFile);
    return Results.Content(json, "application/json");
});

// POST /api/music/favorite
app.MapPost("/api/music/favorite", async (HttpContext context) =>
{
    using var reader = new StreamReader(context.Request.Body);
    var body = await reader.ReadToEndAsync();
    var doc = JsonDocument.Parse(body);
    if (!doc.RootElement.TryGetProperty("id", out var idProp)) return Results.BadRequest();

    var trackId = idProp.GetString();
    var list = JsonSerializer.Deserialize<List<Dictionary<string, object>>>(File.ReadAllText(musicFile));
    var track = list?.FirstOrDefault(t => t["id"].ToString() == trackId);
    if (track == null) return Results.NotFound();

    bool isFav = track.ContainsKey("isFavorite") && (bool)track["isFavorite"];
    track["isFavorite"] = !isFav;
    File.WriteAllText(musicFile, JsonSerializer.Serialize(list, new JsonSerializerOptions { WriteIndented = true }));

    return Results.Ok(new { success = true, track });
});

// POST /api/contact
app.MapPost("/api/contact", async (HttpContext context) =>
{
    using var reader = new StreamReader(context.Request.Body);
    var body = await reader.ReadToEndAsync();
    var list = File.Exists(messagesFile) ? JsonSerializer.Deserialize<List<object>>(File.ReadAllText(messagesFile)) : new List<object>();
    list.Add(JsonSerializer.Deserialize<object>(body));
    File.WriteAllText(messagesFile, JsonSerializer.Serialize(list, new JsonSerializerOptions { WriteIndented = true }));
    return Results.Created("/api/messages", new { success = true, message = "Pesan berhasil disimpan." });
});

app.Run("http://localhost:5000");
