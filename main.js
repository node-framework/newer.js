const { bodyParser, queryParser, renderHTML } = require("./src/middlewares.mjs");

module.exports = {
    NodeServer: require("./src/nodeserver.mjs").default,
    Middlewares: {
        bodyParser,
        queryParser,
        renderHTML
    }
};