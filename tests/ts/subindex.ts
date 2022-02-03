import IndexRoute from ".";
import { Router } from "../../src/main";

// Create a router
const subindex = new Router("/");

// Register index route
subindex.route("/index", new IndexRoute);

// Export the router
export default subindex;