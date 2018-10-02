using Microsoft.AspNetCore.Builder;
using System;

namespace WebSocketSample.Middleware
{
    public static class WebSocketEchoMiddlewareExtension
    {
        public static IApplicationBuilder UseWebSocketEcho(this IApplicationBuilder app, string pathMatch, WebSocketOptions options)
        {
            if (app == null)
            {
                throw new ArgumentNullException(nameof(app));
            }

            app.UseWebSockets(options);

            return app.Map(pathMatch, builder => builder.UseMiddleware<WebSocketEchoMiddleware>());
        }
    }
}
