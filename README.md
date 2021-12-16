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