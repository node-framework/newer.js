import { Router } from "../../lib/main.js";

// Create a router
const index = new Router();

// Add a route
index.route("/index", {
    GET: async ctx => 
        ctx.response += "Hello"
});

// Export the router
export default index;