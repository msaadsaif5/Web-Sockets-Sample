using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace WebSocketSample.Infrastructure
{
    public class TextSubProtocol : ISubProtocol
    {
        public string Name => "ws.text";

        public string Receive(string message)
        {
            return message;
        }

        public async Task SendAsync(string message, WebSocket socket, CancellationToken cancellationToken)
        {
            if (socket.State == WebSocketState.Open)
            {
                await socket.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes(message), 0, message.Length), WebSocketMessageType.Text, true, cancellationToken);
            }
        }
    }
}
