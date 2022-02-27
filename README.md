# Newer.js

[![NPM Version](http://img.shields.io/npm/v/newer.js.svg?style=flat)](https://www.npmjs.org/package/newer.js)
[![NPM Downloads](https://img.shields.io/npm/dm/newer.js.svg?style=flat)](https://npmcharts.com/compare/newer.js?minimal=true)
[![Install Size](https://packagephobia.now.sh/badge?p=newer.js)](https://packagephobia.now.sh/result?p=newer.js)

## Table of Content
- [Quick start](#quick-start)
    + [Installation](#installation)
    + [Creating a simple page](#creating-a-simple-page)
- [Newer.js Core](#newerjs-core)
    + [Context object](#context-object)
    + [Router](#router)
    + [SubDomain](#subdomain)
    + [Cookies](#cookies)
- [Pre-setup server](#presetup-server)
    + [Getting started](#getting-started)
    + [Route handling](#route-handling)
    + [Add a middleware](#middlewares)
    + [Configurations](#configurations)
        * [Server options](#server-options-httpoptions)

## Quick start

Create a simple web server with Newer.js

### Installation
```sh
# npm
npm install --save newer.js
# yarn
yarn add newer.js
```

### Creating a simple page

Create a file named `index.mjs` and insert the following code:

```javascript
// Import from NewerJS
import { Server } from "newer.js";

// Creating a new server
const app = new Server();

// Handle request to "/" route
app.middleware({
    invoke: async (ctx, next) => {
        // Add data to response 
        ctx.response += 'Hello world';
        // Move to next middleware
        await next();
    }
});

// Listen to port 8080
app.listen(8080);

// Get the HTTP or HTTPS server
app.http;

// And some more code here...
```

Run the file and you should see the text `Hello world` in [localhost:8080](http://localhost:8080) and every subdomains or routes

## Newer.js Core

### Context object

- `ctx.response`: The response to the client.
- `ctx.query`: Get query of current request. This field is read-only
- `ctx.body`: Get body of current request. This field is read-only
- `ctx.url`: Get URL of current request. This field is read-only
- `ctx.statusCode`: To get or set the status code (if `ctx.statusCode` is not set it will return `undefined`)
- `ctx.writeFile(path: string)`: Append content of a file to the response
- `ctx.header(name: string, value?: string | number | readonly string[])`: Get or set a single header
- `ctx.headers(headers?: { [name: string]: string | number | readonly string[] })`: Set headers or get all headers if the argument is a falsy value
- `ctx.socket`: The request socket. This field is read-only
- `ctx.method`: The request method. This field is read-only
- `ctx.httpVersion`: The request HTTP version. This field is read-only
- `ctx.remoteAddress`: The server IPv4. This field is read-only
- `ctx.rawRequest`: The raw request and response. This field is read-only:
    + `ctx.rawRequest.req`: The raw request
    + `ctx.rawRequest.res`: The raw response

### Route handling

Router is a middleware that handles a specific route and sub-route

To create a router middleware, use `new Router()` with:
- `path: string`: The router base path

To handle a route, use `router.route` with the following arguments:
- `routeName: string`: The route name
- `routeHandler: Handler`: The route handler

To register a middleware, use `router.middleware` with:
- `...m: Middleware[]`: Middlewares to register

#### Example

```javascript
// Import from NewerJS
import { Router } from "newer.js";

// Create a router
const index = new Router("/index");

index.middleware({
    invoke: async (ctx, next) => {
        // Add to every response in route
        ctx.response += "You are on path ";
        // Go to next middleware or route handler
        await next();
    }
});

// Create a handler of sub-route / -> This will be called if the request pathname is `/index`
index.route("/", {
    GET: async ctx => {
        // Write the response
        ctx.response += ctx.url;
    }
});
```

You can nest Routers using `router.middleware`

### Sub-domain handling

Handles a specific sub-domain

To create a sub-domain middleware, use `new SubDomain()` with:
- `domain: string`: The sub-domain name

To register a middleware, use `subDomain.middleware` with:
- `...m: Middleware[]`: Middlewares to register

#### Example

```javascript
// Import from NewerJS
import { SubDomain } from "newer.js";

// Create a new subdomain handler (example `sub.example.com`)
const sub = new SubDomain("sub");

// Register a middleware
sub.middleware({
    invoke: async (ctx, next) => {
        // Add to response
        ctx.response += "Hello, you are on sub-domain 'sub'";

        // Move to next middleware
        await next();
    }
});
```

You can nest subdomains using `sub.middleware`

### Cookie

Get and set cookie using `ctx.cookie` which can be used for session management

To create a cookie middleware, use `new Cookie()` with:
- `options: CookieOptions`: The cookie options

#### Example

```javascript
// Import from NewerJS
import { Cookie } from "newer.js";

// Add the cookie middleware to 'app'
app.middleware(new Cookie({
    // Cookies last for 120 seconds
    maxAge: 120000
}));

// Example use
app.middleware({
    invoke: async (ctx, next) => {
        // Get cookies
        ctx.cookie;

        // Set cookies
        ctx.cookie = {
            // Properties here...
        };

        // Invoke next middleware
        await next();
    }
});
```

## Pre-setup server

Set up a server with just 3 lines of code

### Getting started

Create a file named `index.mjs` and write:

```javascript
import { app } from "newer.js";

app.start();
```

Set up a project structure:
```sh
public ## Or the static directory that matches the configuration
src ## Source codes
    controllers ## App controllers
    middlewares ## App middlewares
```

### Route handling
To add a route handler, for example `/`, create a file in `src/controllers` and write:
```javascript
export default {
    // Route '/'
    "/": {
        // GET method
        GET: async ctx => {
            // Handles the route ...
        }
    }
}
```

Or if you want to use CommonJS, replace `export default` with `module.exports`:
```javascript
module.exports = {
    // Route '/'
    "/": {
        // GET method
        GET: async ctx => {
            // Handles the route ...
        }
    }
}
```

### Middlewares
To add a middleware, create a file in `src/middlewares` that export a middleware:
```javascript
export default {
    invoke: async (ctx, next) => {
        // Some more code here ...
        await next();
    }
}
```

Or using CommonJS module:
```javascript
module.exports = {
    invoke: async (ctx, next) => {
        // Some more code here ...
        await next();
    }
}
```

### Configurations
Use `app.config` with an object that has these properties:

- `projectPath: string`: The project root. Defaults to `.`
- `static: string`: The default static directory. Defaults to `public`

#### Server options (`httpOptions`)
- `port: number`: The server port. Defaults to 80
- `hostname: string`: The server hostname. Defaults to `localhost`
- `httpsMode: boolean`: Toggle HTTPS mode. Defaults to `false`
- `backlog: number`: The server backlog. Defaults to `0`
- `advanced: http.ServerOptions | https.ServerOptions`: Other server options 