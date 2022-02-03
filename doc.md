# Documentation

## SimpleOptions
The simple server options

### Type
- `interface`

### Properties 

- `options?: http.ServerOptions | https.ServerOptions`
    + HTTP or HTTPS server options

- `httpsMode?: boolean`
    + Toggle HTTPS mode
    + Set it to true will change the core server to HTTPS
    + Defaults to `false`

- `port?: number`
    + The target server port
    + Defaults to `80`

- `hostname?: string`
    + The target server hostname
    + Defaults to `localhost`

- `backlog?: number`
    + The server backlog.
    + Defaults to `0`

## simple
Simple use ES6+ syntax to create a simple HTTP or HTTPS server which handle `request` event

### Type
- `function`

### Returns
- `server`: The HTTP or HTTPS server which is started
- `[Symbol.asyncIterator]()`: The iterator for iterating through requests using `for await ... of`

## Server
Create a server using objects (which makes it easier to maintain)

### Type
- `class`

### Constructor
- Accepts two arguments:
    + `options`: The HTTP or HTTPS server options. Defaults to `undefined`
    + `httpsMode`: Set to true will change the core server to HTTPS. Defaults to `false`

### Properties
- `http`:
    + Read-only
    + Returns the current HTTP or HTTPS server
    + Remains `undefined` when the server is not running

### Methods
- `route`
    + Handle a specific route
    + `routeName: string`: The route name to be handled
    + `route: Handler`: The route handler object
    + Returns the server for chaining

- `sub`
    + Handle a subdomain
    + `host: string`: The subdomain name
    + `route: Router`: The subdomain handler
    + Returns the server for chaining

- `middleware`
    + Register a middleware
    + `m: Middleware`: The middleware to add
    + Returns the server for chaining

- `icon`
    + Set the icon path (Defaults `./favicon.ico`)
    + `path: string`: The icon path
    + Returns the server for chaining

- `listen`
    + Start the server
    + Asynchronous
    + `port: number`: The target port. Defaults to `80`
    + `hostname: string`: The target hostname. Defaults to `localhost`
    + `backlog: number`: The server backlog. Defaults to `0`
