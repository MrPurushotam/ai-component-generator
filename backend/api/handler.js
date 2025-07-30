const app = require("../src/index.js");
const serverless = require('serverless-http');

module.exports = serverless(app)