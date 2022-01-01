## NodeServer

```typescript

// Server options
type ServerOptions = {
    port?: number;
    hostname?: string;
} & http.ServerOptions;

// Middlewares and route handlers type 
type ServerHandlers = (req: http.IncomingMessage, res: http.ServerResponse, raise: (err: Error) => void) => Promise<void> | void;

// The server
class NodeServer {
    // The port
    readonly port: number;

    // The hostname
    readonly hostname: string;

    // param `options`: server options, type ServerOptions
    constructor(options?: ServerOptions);
    
    // Register an error handler
    onError: (fn: (err: Error) => void) => this;
    
    // Start the server
    start: () => Promise<NodeServer>;
    
    // Stop the server
    stop: () => Promise<NodeServer>;
    
    // Register a route
    register: (route: string, listener: (req: http.IncomingMessage, res: http.ServerResponse, raise: (err: Error) => void) => Promise<void> | void) => this;
    
    // Use the middleware
    use: (...listener: ((req: http.IncomingMessage, res: http.ServerResponse, raise: (err: any) => void) => Promise<void> | void)[]) => NodeServer;
    
    // Returns a callback which can be used as listener for http.createServer or https.createServer
    callback: () => (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
}
```

## Built-in response methods

```typescript
// Redirect to another page
res.redirect = (url: string) => http.ServerResponse;

// Write content of a page to another
res.writePage = (url: string) => http.ServerResponse;
```

## Middlewares

```typescript

// Exports of middlewares.js which can be imported all as Middleware
const exports: {
    // get query of a GET request
    queryParser: (req: http.IncomingMessage) => {
        [k: string]: string;
    };

    // get body of a POST request
    bodyParser: (req: http.IncomingMessage) => Promise<qs.ParsedQuery<string>>;
};
```

## JsonDB

```typescript
// A schema instance
// Result after calling new Schema
type SchemaInstance = {
    // Save the object and trigger save-item event
    save: () => Promise<object>;

    // delete the object from the database and trigger delete-item event
    del: () => Promise<object>;

    // update the object and trigger update-item event
    update: (obj: object) => Promise<object>;
};

// Database events
type DBEvents = "save-item" | "update-item" 
            | "delete-item" | "clear-schema" 
            | "clear-database" | "drop-database" 
            | "drop-schema";
/**
 * Schema type
 */
type Schema = {
    // Constructor has 1 argument
    // obj: the object to check if match the schema
    new (obj: object): SchemaInstance;

    // read the database and returns all object that matches the schema
    read: () => object[];

    // Check whether input object matches the schema
    match: (obj: object) => boolean;

    // Schema name
    schem: string;

    // Find an object in a database
    // Accept 3 arguments
    // obj: the obj to find, set it to a falsy value will return all the object in the database
    // count: the number of objects to return
    // except: if set to true find the objects that doesn't match the input obj
    find: (obj?: object, count?: number, except?: boolean) => Promise<object[] | object>;

    // Create a list of schema instance with input objects
    create: (...obj: object[]) => SchemaInstance[];

    // Update the input object with another and trigger save-item event
    update: (obj: object, updateObj: object) => Promise<object>;

    // Clear the schema and trigger clear-schema event 
    clear: () => Promise<void>;

    // Delete all object that matches the object
    deleteMatch: (obj?: object, except?: boolean) => Promise<void>;

    // Drop the schema and trigger drop-schema event
    drop: () => Promise<void>;
};
class JsonDB {
    // The reviver
    readonly filePath: string;
    
    // The reviver
    readonly reviver: (key: string, value: any) => any;
    
    // Constructor has 2 arguments
    // filePath points to the database path
    // reviver to revive the property type of the database
    constructor(filePath: string, reviver?: (key: string, value: any) => any);
    
    // Handle database event with a specified listener
    on: (event: DBEvents, listener: (...args: any[]) => void) => any;

    // Create or get a schema
    schema: (name: string, schem?: object) => Schema;
     
    // Clear the database and trigger clear-schema event
    clear: () => Promise<void>;
    
    // Drop the schema if given and trigger the drop-schema event
    // Will drop the database and trigger drop-database event if schema argument is given a falsy value
    drop: (schema?: Schema | string) => Promise<void>;
}
```
