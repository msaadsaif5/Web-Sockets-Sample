using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace WebSocketSample.Infrastructure
{
    public interface ISubProtocol 
    {
        string Name { get; }
        Task SendAsync(string message, WebSocket socket, CancellationToken cancellationToken);
        string Receive(string message);
    }
}
