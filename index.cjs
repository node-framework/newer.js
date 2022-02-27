// Change require to be able to require ES modules
require = require("esm")(module);

// Export
module.exports = require("./lib/main.js");