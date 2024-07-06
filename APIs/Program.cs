using APIs.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System;
using System.Diagnostics.Metrics;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

using var scope = app.Services.CreateScope();
var _Db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
if (_Db != null)
{
    if (_Db.Database.GetPendingMigrations().Any())
    {
        _Db.Database.Migrate();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.MapGet("/posts", async (AppDbContext db, int page = 1, int pageSize = 10) =>
{
    if (page < 1) page = 1;
    if (pageSize < 1) pageSize = 10;

    var numberOfPosts = await db.Posts.CountAsync();
    var numberOfPages = (int)Math.Ceiling(numberOfPosts / (double)pageSize);

    var posts = await db.Posts
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    var result = new
    {
        TotalPosts = numberOfPosts,
        Page = page,
        PageSize = pageSize,
        TotalPages = numberOfPages,
        Posts = posts
    };

    return Results.Ok(result);
});

app.MapPost("/posts", async (AppDbContext db, Post newpost) =>
{
    db.Posts.Add(newpost);
    await db.SaveChangesAsync();
    return Results.Created($"/posts/{newpost.Id}", newpost);
});

app.MapGet("/posts/{postId}", async (AppDbContext db, int postId) =>
{
    var post = await db.Posts.Include(p => p.Comments).FirstOrDefaultAsync(p => p.Id == postId);

    if (post == null)
    {
        return Results.NotFound("Post not found");
    }

    return Results.Ok(post);
});

app.MapGet("/posts/{postId}/comments", async (AppDbContext db, int postId, int page = 1, int pageSize = 5) =>
{
    var post = await db.Posts.FindAsync(postId);

    if (post == null)
    {
        return Results.NotFound("Post not found");
    }

    if (page < 1) page = 1;
    if (pageSize < 1) pageSize = 10;

    var numberOfComments = await db.Comments.Where(c => c.PostId == postId).CountAsync();
    var numberOfPages = (int)Math.Ceiling(numberOfComments / (double)pageSize);

    var comments = await db.Comments.Where(c => c.PostId == postId)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    var result = new
    {
        TotalPosts = numberOfComments,
        Page = page,
        PageSize = pageSize,
        TotalPages = numberOfPages,
        Comments = comments
    };

    return Results.Ok(result);
});

app.MapPost("/posts/{postId}/comments", async (AppDbContext db, int postId, Comment newcomment) =>
{
    var post = await db.Posts.FindAsync(postId);

    if (post == null)
    {
        return Results.NotFound("Post not found");
    }

    newcomment.PostId = postId;
    db.Comments.Add(newcomment);
    await db.SaveChangesAsync();

    return Results.Created($"/posts/{postId}/comments/{newcomment.Id}", newcomment);
});


app.Run();
