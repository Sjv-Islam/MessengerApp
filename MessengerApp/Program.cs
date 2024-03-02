using MessengerApp.Hubs;

namespace MessengerApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddSignalR(opt =>
            {
                opt.MaximumReceiveMessageSize = 1024 * 1024 * 2;
            });
            builder.Services.AddCors();

            var app = builder.Build();

            app.UseCors(opt =>
            {
                opt.WithOrigins("https//localhost:4200", "http//localhost:4200")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .SetIsOriginAllowed((host) =>true)
                .AllowCredentials();
            });

            app.MapHub<ChatHub>("/chat");
            //app.MapGet("/", () => "Hello World!");

            app.Run();
        }
    }
}
