import { SubDomain } from "../../src/main";
import { Server } from "../../src/main";
import subindex from "./subindex";

// Server
const app = new Server();

// Register a subdomain
app.middleware(
    new SubDomain("www")
        .middleware(subindex)
);

// Listen to port 80
app.listen(80);