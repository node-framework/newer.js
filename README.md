# Async server

- Async server is a lightweight Express-like framework
- Build with native Node.js HTTP

## Getting started

- To create a server, use:

```javascript
import { NodeServer } from "async-server";

// Port: 8080, Host: localhost
const app = new NodeServer();
```

- You can set the target port and hostname using:

```javascript
const app = new NodeServer({
    port: 8080 // Your port (Default to 8080)
    hostname: "127.0.0.1" // Your hostname (Default to 127.0.0.1 which is localhost)
});
```

- Next, we will register a route called `/index` and write out "Hello World"

```javascript
import { NodeServer } from "async-server";

const app = new NodeServer();

// Register /index route
app.register("/index", (req, res) => {
  res.write("Hello World");
});
```

- Finally start the server

```javascript
import { NodeServer } from "async-server";

const app = new NodeServer();

// Register /index route
app.register("/index", (req, res) => {
  res.write("Hello World");
});

// Start the server
await app.start();
```

- Go to http://localhost:8080/index and you should see the text "Hello World"
- Async server supports chaining so the code above can be shorten:

```javascript
import { NodeServer } from "async-server";

// Create the server
await new NodeServer()
  // Register the route
  .register("/index", (req, res) => {
    res.write("Hello World");
  })
  // Start the server
  .start();
```

To use req.query and req.body use:

```javascript
import { NodeServer, Middlewares } from "async-server";

// Create the server
const app = new NodeServer();

// Use middlewares
app.use(Middlewares.queryParser, Middlewares.bodyParser);

// Register /index route
app.register("/index", (req, res) => {
  res.write("Hello " + req.query.name);
});

// Start the server
await app.start();
```

- Or even shorter

```javascript
import { NodeServer, Middlewares } from "async-server";

// Create the server
await new NodeServer()
  // Register middlewares
  .use(Middlewares.queryParser, Middlewares.bodyParser)
  // Register the route
  .register("/index", (req, res) => {
    res.write("Hello " + req.query.name);
  })
  // Start the server
  .start();
```

- Go to http://localhost:8080/index?name=Reve and you will see the text "Hello Reve"

## JsonDB

- JsonDB is a type of local database which data is stored in a local `.json` file.
- Suitable for publishing web apps to cloud

### Examples

1. Creating a database,
2. create a schema called user with `name` property typed `string` and `id` property typed `number`
3. create objects that matched the schema and save it to the database
4. Search for user with name equals `Alex` and object count set to 1 to returns only 1 object
5. Clear all the objects belong to the schema that was created before
6. Clear the database

```javascript
import { JsonDB } from "async-server";

// 1
const db = new JsonDB("Your json file path");

// 2
const User = db.schema("User", {
    name: String,
    id: Number
});

// 3
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

// 4
await User.find({
    name: "Alex"
}, 1).then(console.log);

// 5
await User.clear();

// 6
await db.clear();
```

- Examples: https://github.com/aquapi/async-server/tree/main/example

