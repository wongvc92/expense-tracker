using api.Data;
using api.interfaces;
using api.middleware;
using api.Models;
using api.Repository;
using api.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IExpenseRepository, ExpenseRepositoy>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IIncomeRepository, IncomeRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();


builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true; // Optional: Pretty formatting
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Your frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.Configure<ResendSettings>(builder.Configuration.GetSection("Resend"));
builder.Services.AddHttpClient<IEmailSender, ResendEmailSender>();


builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{


    // Identity options (optional, customize as needed)
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.SignIn.RequireConfirmedEmail = true; // Require email confirmation

    options.User.AllowedUserNameCharacters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+ ";

    options.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultProvider;
    options.Tokens.AuthenticatorTokenProvider = TokenOptions.DefaultAuthenticatorProvider;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// Configure token provider options
builder.Services.Configure<DataProtectionTokenProviderOptions>(options =>
{
    options.TokenLifespan = TimeSpan.FromHours(48); // Set token expiration to 48 hours
});

// Configure Cookie settings for Identity
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.LoginPath = "/auth/login"; // Adjust to your login endpoint
    options.ExpireTimeSpan = TimeSpan.FromMinutes(60); // Set cookie expiration time
    options.SlidingExpiration = true; // Enable sliding expiration to extend session
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Events.OnRedirectToLogin = context =>
    {
        // Prevent redirect for API endpoints, return 401 instead
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        }

        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };
});


builder.Services.AddAuthentication(options =>
{

    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie()
.AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
{
    options.ClientId = builder.Configuration["GOOGLE_OAUTH_CLIENT_ID"]!;
    options.ClientSecret = builder.Configuration["GOOGLE_OAUTH_CLIENT_SECRET"]!;
    options.CallbackPath = "/signin-google";
    options.Scope.Add("profile"); // Add profile scope
    options.ClaimActions.MapJsonKey("picture", "picture"); // Map the picture claim
    options.SaveTokens = true;
});


builder.Services.AddAuthorization();
builder.Services.AddOpenApi();
var app = builder.Build();

app.UseExceptionHandler();
// middleware to refresh cookies
app.Use(async (context, next) =>
{
    if (context.User.Identity?.IsAuthenticated == true)
    {
        var authResult = await context.AuthenticateAsync();
        if (authResult.Succeeded && authResult.Properties?.ExpiresUtc != null)
        {
            var remainingTime = authResult.Properties.ExpiresUtc.Value - DateTimeOffset.UtcNow;
            if (remainingTime < TimeSpan.FromMinutes(10)) // Refresh if less than 10 minutes left
            {
                await context.SignInAsync(authResult.Principal, authResult.Properties);
            }
        }
    }
    await next();
});

// Configure the HTTP request pipeline.
app.UseRouting();
app.UseCors("AllowSpecificOrigin");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseMiddleware<SessionTrackingMiddleware>();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();
