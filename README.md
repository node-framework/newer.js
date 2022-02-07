# Get started with Newer.js

Start easy development server with Newer.js!

## Installation
```sh
# npm
npm install --save newer.js
# yarn
yarn add newer.js
```
## Table of Content
- [Creating a simple page](#creating-a-simple-page)
- [Context object](#context-object)
- [Router](#router)
- [SubDomain](#subdomain)
- [JsonDB](#jsondb)
- [JsonDB Example](#example)



## Creating a simple page

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

### Context object

- `ctx.response`: The response to the client
- `ctx.query`: Get query of current request. This field is read-only
- `ctx.body`: Get body of current request. This field is read-only
- `ctx.url`: Get URL of current request. This field is read-only
- `ctx.statusCode`: To get or set the status code (if `ctx.statusCode` is not set it will return `undefined`)
- `ctx.writeFile(path: string)`: Append content of a file to the response
- `ctx.header(name: string, value?: string | number | readonly string[])`: Getor set a single header
- `ctx.headers(headers?: { [name: string]: string | number | readonly string[] })`: Set headers or get all headers if the argument is a falsy value
- `ctx.socket`: The request socket. This field is read-only
- `ctx.method`: The request method. This method is read-only
- `ctx.httpVersion`: The request HTTP version. This method is read-only
- `ctx.remoteAddress`: The server IPv4

- Examples: https://github.com/node-framework/newer.js-example

### Router

- Router is a middleware that handles a specific route and sub-route

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

// Create a handler of route index
index.route("/", {
    GET: async ctx => {
        // Write the response
        ctx.response += ctx.url;
    }
});
```

- You can nest Routers using `router.middleware`

## SubDomain

- SubDomain is a middleware that handles a specific subdomain

```javascript
// Import from NewerJS
import { SubDomain } from "newer.js";

// Create a new subdomain handler (example `sub.example.com`)
const sub = new SubDomain("sub");

// Register a middleware
sub.middleware({
    invoke: async (ctx, next) => {
        // Add to response
        ctx.response += "Hello, you are on subdomain 'sub'";
        // Move to next middleware
        await next();
    }
});
```

- You can nest subdomains using `sub.middleware`

## Not into these type of frameworks?

- `simple` is the type of server which use Deno-like syntax
- This code below creates a simple "Hello world" server on [localhost](http://localhost):

```javascript
// Import from NewerJS
import { simple } from "newer.js";

// Create a new server and handle each requests
for await (const response of simple()) 
    // End the response
    response.end("Hello world");
```

- You can get the raw HTTP or HTTPS server via `simple().server`

## JsonDB

- JsonDB is a type of local database which data is stored in a local `.json` file.

### Example
 
```javascript
// Import from NewerJS
import { JsonDB } from "newer.js";

// Create a database
const db = new JsonDB("Your json file path");

// Create a schema called user with `name` property typed `string` and `id` property typed `number`
const User = db.schema("User", {
    name: String,
    id: Number 
});

// Create objects that matched the schema and save it to the database
let user = new User({
    name: "Reve", // Matches type "String"
    id: 863068 // Matches type "Number"
});

await user.save(); // Save to database

let user1 = new User({
    name: "Alex", // Matches type "String"
    id: 509390 // Matches type "Number"
});

await user1.save(); // Save to database

// Search for user with name equals `Alex` and object count set to 1 to returns only 1 object
await User.find({
    name: "Alex"
}, 1).then(console.log);

// Clear all the objects belong to the schema that was created before
await User.clear();

// Clear the database
await db.clear();
```


