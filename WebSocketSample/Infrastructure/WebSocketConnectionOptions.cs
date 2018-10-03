using System;
using System.Collections.Generic;

namespace WebSocketSample.Infrastructure
{
    public class WebSocketConnectionOptions
    {
        public ISubProtocol DefaultProtocol { get; set;  }
        public IList<ISubProtocol> SupportedProtocols { get; set; }
        public int ReceiveBufferSize { get; set; }
        public TimeSpan KeepAliveInterval { get; set; }

        public WebSocketConnectionOptions()
        {
            ReceiveBufferSize = 4 * 1024;
            KeepAliveInterval = TimeSpan.FromSeconds(120);
        }
    }
}
