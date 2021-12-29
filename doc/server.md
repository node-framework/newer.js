## NodeServer

```typescript
// The port the server will be listening to
port: number

// The hostname the server will be listening to
hostname: string

// The static path
staticPath: string

// The constructor contains one argument as the server option
// contains 'port' default to 8080 and 'hostname' default to '127.0.0.1' which is localhost
constructor: ({ port?: number; hostname?: string }) => NodeServer

// Start the server
start: () => Promise<NodeServer>

// Stop the server
stop: () => Promise<NodeServer>

// Register a route (can be async)
register: (route: string, listener: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void> | void) => NodeServer

// Use middlewares
use: (...listener: (
    (req: http.IncomingMessage, res: http.ServerResponse, server: NodeServer) => Promise<void> | void
)[]) => NodeServer

// Set static path
useStaticPath: (pathname: string) => NodeServer

// Returns the handler of the server, which can be used as listener of http.createServer or https.createServer
callback: () =>
    async (req: http.IncomingMessage, res: http.ServerResponse): Promise<void>
```

## Middlewares

```typescript
// Get query of a GET request
queryParser: (req: http.IncomingMessage) => {
    [k: string]: string;
};

// Get body of a POST request
bodyParser: (req: http.IncomingMessage) => Promise<import("query-string").ParsedQuery>;

// Render HTML using res.render and res.renderSync
renderHTML: (_: any, res: http.ServerResponse, server: NodeServer) => void;

// Serve static HTML files. Use with renderHTML middleware
serveStatic: (home?: string) => (req: http.IncomingMessage, res: http.ServerResponse) => Promise<any>;
```

## JsonDB

```typescript
// Result after calling new Schema(obj: object)
type SchemaInstance;

// Database events
type DBEvents;

// Schema type
type Schema;

// the target file path
readonly filePath: string;

// The reviver
readonly reviver: (key: string, value: any) => any;

// Constructor includes 2 args:
// filePath: path to database
// reviver: convert objects when parsing
constructor(filePath: string, reviver?: (key: string, value: any) => any);

// Handle events with a specific handler
on: (event: DBEvents, listener: (...args: any[]) => void) => any;

// Create or get a schema
schema: (name: string, schem?: object) => Schema;

// Clear the database
clear: () => Promise<void>;

// Drop the database
drop: (schema?: Schema | string) => Promise<void>;
```
