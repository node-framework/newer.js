# Newer.js
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fnode-framework%2Fnewer.js.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fnode-framework%2Fnewer.js?ref=badge_shield)


- Async server is a lightweight Express-like framework
- Build with native Node.js HTTP

## Getting started

- To create a server, use:

```javascript
import { Server } from "newer.js";

const app = new Server();
```

- Next, we will register a route called `/index` and write out "Hello World"

```javascript
import { Server } from "newer.js";

const app = new Server();

class IndexPage {
    async GET(ctx) {
        ctx.response = "Hello world";
    }
}

// Register the route
app.route("/index", new IndexPage());
```

- Finally listen to localhost and port 80

```javascript
import { NodeServer } from "newer.js";

const app = new Server();

class IndexPage {
    async GET(ctx) {
        ctx.response = "Hello world";
    }
}

// Register the route
app.route("/index", new IndexPage());

// Port default to 8080, host default to localhost, backlog default to 0
await app.listen(80);
```

- Go to http://localhost:8080/index and you should see the text "Hello World"
- Async server supports chaining so the code above can be shorten:

```javascript
import { Server } from "newer.js";

// Create the server
await new Server()
  // Register the route
  .route("/index", new class IndexPage {
        async GET(ctx) {
            ctx.response = "Hello world";
        }
  })
  // Start the server
  .listen(80);
```

### Context

- `ctx.query`: Get query of current request
- `ctx.body`: Get body of current request
- `ctx.url`: Get URL of current request
- `ctx.statusCode`: To get or set the status code (if `ctx.statusCode` is not set it will return `undefined`)

- Examples: https://github.com/node-framework/newer.js-example

## JsonDB

- JsonDB is a type of local database which data is stored in a local `.json` file.
- JsonDB is fast and lightweight

### Example

```javascript
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

- Important: Don't download Beta or Alpha or Test versions

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fnode-framework%2Fnewer.js.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fnode-framework%2Fnewer.js?ref=badge_large)