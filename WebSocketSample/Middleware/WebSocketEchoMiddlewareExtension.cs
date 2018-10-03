using Microsoft.AspNetCore.Builder;
using System;
using WebSocketSample.Infrastructure;

namespace WebSocketSample.Middleware
{
    public static class WebSocketEchoMiddlewareExtension
    {
        public static IApplicationBuilder UseWebSocketEcho(this IApplicationBuilder app, string pathMatch, WebSocketConnectionOptions options)
        {
            if (app == null)
            {
                throw new ArgumentNullException(nameof(app));
            }

            app.UseWebSockets(new WebSocketOptions { KeepAliveInterval = options.KeepAliveInterval, ReceiveBufferSize = options.ReceiveBufferSize });

            return app.Map(pathMatch, builder => builder.UseMiddleware<WebSocketEchoMiddleware>(options));
        }
    }
}
