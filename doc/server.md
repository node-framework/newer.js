- `NodeServer.prototype`
```typescript

port: number
// The port the server will be listening to

hostname: string
// The hostname the server will be listening to

staticPath: string
// The static path

constructor: ({ port?: number; hostname?: string }) => NodeServer
// The constructor contains one argument as the server option 
// contains 'port' default to 8080 and 'hostname' default to '127.0.0.1' which is localhost

start: () => Promise<NodeServer>
// Start the server

stop: () => Promise<NodeServer>
// Stop the server

register: (route: string, listener: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void> | void) => NodeServer 
// Register a route (can be async)

use: (...listener: (
    (req: http.IncomingMessage, res: http.ServerResponse, server: NodeServer) => Promise<void> | void
)[]) => NodeServer
// Use middlewares

useStaticPath: (pathname: string) => NodeServer
// Set static path

callback: () => 
    async (req: http.IncomingMessage, res: http.ServerResponse): Promise<void>
// Returns the handler of the server, which can be used as listener argument of http.createServer or https.createServer

```