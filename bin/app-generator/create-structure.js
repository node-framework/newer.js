const fs = require("fs");

/**
 * Create the default structure
 */
function createDefault() {
    
}

/**
 * Create the pre-setup structure
 */
function createPreSetup() {
    // Create the directories
    if (!fs.existsSync("./src/middlewares")) {
        if (!fs.existsSync("./src"))
            fs.mkdirSync("./src");
        fs.mkdirSync("./src/middlewares");
    }

    // Create index and hello middleware
    fs.appendFileSync("./src/middlewares/hello.js", `
/**
 * @type {import("newer.js/app").NewerMiddleware}
 */
module.exports = {
    async invoke(ctx, next) {
        ctx.response = "Hello World!";
        await next();
    }
};
`
    );

    fs.appendFileSync("./index.js", `
import Application from "newer.js/app";

Application.start();
`);
}

module.exports = type => {
    switch (type) {
        case "default": 
            createDefault();
            break;
        case "pre-setup":
            createPreSetup();
            break;
    }
}