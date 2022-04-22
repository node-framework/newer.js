const cp = require("child_process");
const fs = require("fs");

module.exports = (pkg, esm) => {
    switch (pkg) {
        case "npm": 
            cp.execSync("npm install nodemon --save-dev");
            cp.execSync("npm install dotenv");
            break;
        case "yarn": 
            cp.execSync("yarn add nodemon --dev");
            cp.execSync("yarn add dotenv");
    }

    // Add scripts
    let data = JSON.parse(fs.readFileSync("./package.json"));
    data.main = esm ? "./index.mjs" : "./index.js";
    data.scripts = {
        "dev": "nodemon index.js",
        "start": "node index.js",
    };
    fs.writeFileSync("./package.json", JSON.stringify(data, null, 4));
}