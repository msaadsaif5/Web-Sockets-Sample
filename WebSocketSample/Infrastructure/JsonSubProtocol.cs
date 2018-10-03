using Newtonsoft.Json;
using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace WebSocketSample.Infrastructure
{
    public class JsonSubProtocol : ISubProtocol
    {
        public string Name => "ws.json";

        public string Receive(string message)
        {
            return message;
        }

        public async Task SendAsync(string message, WebSocket socket, CancellationToken cancellationToken)
        {
            var msg = JsonConvert.SerializeObject(new { message, timestamp = DateTime.UtcNow });

            if (socket.State == WebSocketState.Open)
            {
                await socket.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes(msg), 0, msg.Length), WebSocketMessageType.Text, true, cancellationToken);
            }
        }
    }
}
