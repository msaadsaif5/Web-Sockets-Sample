using Microsoft.AspNetCore.Http;
using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using WebSocketSample.Infrastructure;

namespace WebSocketSample.Middleware
{
    public class WebSocketEchoMiddleware
    {
        readonly WebSocketConnectionOptions options;
        public WebSocketEchoMiddleware(RequestDelegate next, WebSocketConnectionOptions options)
        {
            this.options = options;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.WebSockets.IsWebSocketRequest)
            {
                ISubProtocol subProtocol = DetectSubProtocol(context);

                WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync(subProtocol?.Name);

                var buffer = new byte[options.ReceiveBufferSize];

                WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                subProtocol = subProtocol ?? options.DefaultProtocol;
                while (!result.CloseStatus.HasValue)
                {
                    if (result.MessageType == WebSocketMessageType.Text)
                    {
                        var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                        await subProtocol.SendAsync(message, webSocket, CancellationToken.None);

                    }
                    result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                }
                await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
            }
            else
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
            }
        }

        ISubProtocol DetectSubProtocol(HttpContext context)
        {
            ISubProtocol subProtocol = null;

            foreach (var supportedProtocol in options.SupportedProtocols)
            {
                if (context.WebSockets.WebSocketRequestedProtocols.Contains(supportedProtocol.Name))
                {
                    subProtocol = supportedProtocol;
                    break;
                }
            }

            return subProtocol;
        }
    }
}
