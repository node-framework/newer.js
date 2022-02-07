import { Router, StaticDir } from "../../src/main";
import { Server } from "../../src/main";

// Server
const app = new Server();

// Register a static directory
app.middleware(new StaticDir("./tests/public"));

// Listen to port 80
app.listen(80);