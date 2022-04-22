const fs = require("fs");

const writePath = (path, type, content) => {
    if (!fs.existsSync(path))
        switch (type) {
            case "folder":
                fs.mkdirSync(path);
                break;
            case "file":
                fs.appendFileSync(path, content);
                break;
        }
};

function importStatement(esm = false, prop) {
    return `${esm ? "import" : "const"} ${prop} ${esm ? "from " : "= require("}"newer.js"${!esm ? ")" : ""};`;
}

function loadEnv(esm) {
    return !esm ? `require("dotenv").config();` : "import \"dotenv/config\";";
}

function exportStatement(esm, prop) {
    return (esm ? "export default " : "module.exports = ") + prop + ";";
}

/**
 * Create the default structure
 */
function createDefault(esm = false) {
    // Index file
    writePath(esm ? "./index.mjs" : "./index.js", "file",
`${importStatement(esm, "{ Server, CORS, StaticDir }")}
${esm ? `import router from "./routes/index.mjs";` : ""}
${loadEnv(esm)}

const app = new Server();

app.middleware(new CORS());
app.middleware(new StaticDir("./public"));
app.middleware(${esm ? "router" : `require("./routes")`});

app.listen(Number(process.env.PORT) || 8080);
`
    );

    // Create folders
    writePath("./routes", "folder");
    writePath("./public", "folder");
    writePath("./models", "folder");
    writePath(".env", "file", "PORT=8080");

    // Create the route index file
    writePath(esm ? "./routes/index.mjs" : "./routes/index.js", "file", 
`${importStatement(esm, "{ Router }")}

const router = new Router("/");
    
router.route("/", {
    GET(ctx) {
        ctx.response = "Hello World!";
    }
});
    
${exportStatement(esm, "router")}`
    );
}

module.exports = createDefault;