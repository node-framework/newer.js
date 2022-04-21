const cp = require("child_process");
const fs = require("fs");

module.exports = pkg => {
    switch (pkg) {
        case "npm": 
            cp.execSync("npm init");
            cp.execSync("npm install newer.js@latest nodemon");
            break;
        case "yarn": 
            cp.execSync("yarn init");
            cp.execSync("yarn add newer.js@latest nodemon");
    }

    // Add scripts
    let data = JSON.parse(fs.readFileSync("./package.json"));
    data.scripts = {
        "dev": "nodemon index.js",
        "start": "node index.js",
    };
    fs.writeFileSync("./package.json", JSON.stringify(data, null, 4));
}