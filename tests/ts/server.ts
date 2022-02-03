import { Server } from "../../src/main";
import subindex from "./subindex";

// Server
const app = new Server();

// Register a subdomain
app.sub("www", subindex);

// Register the router
app.middleware(subindex);

// Listen to port 80
app.listen(80);