# Get started with Newer.js

Start develop a web app with Newer.js!

## Installation

|        NPM       |         Yarn        |
|:----------------:|:-------------------:|
| `npm i newer.js` | `yarn add newer.js` |

## Creating a simple page

Create a file named `index.mjs` and insert the following code:

```javascript
// Import from NewerJS
import { Server } from "newer.js";

// Creating a new server
const app = new Server();

// Handle request to "/" route
app.route("/", {
    // Handle GET request
    GET: async ctx => {
        ctx.response += "Hello world";
    }
});

// Listen to port 8080
await app.listen(8080);
```

Run the file and you should see the text `Hello world` in [localhost:8080](http://localhost:8080)

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

## Not into these type of frameworks?

- `simple` is the type of server which use Deno-like syntax
- `simple` is created to be as fast as possible 
- Speed comparison (10 tests): 
    + https://github.com/node-framework/newer.js/blob/main/tests/simple.mjs: `simple`
    + https://github.com/node-framework/newer.js/blob/main/tests/native.mjs: Node.js HTTP

- This code below creates a simple "Hello world" server on [localhost](http://localhost):

```javascript
// Import from NewerJS
import { simple } from "newer.js";

// Create a new server and handle each requests
for await (const response of simple()) 
    // End the response
    response.end("Hello world");
```

## JsonDB

- JsonDB is a type of local database which data is stored in a local `.json` file.
- JsonDB is fast and lightweight

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

## Warnings

- Don't download Beta or Alpha versions. Using them may break your application

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fnode-framework%2Fnewer.js.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fnode-framework%2Fnewer.js?ref=badge_large)


