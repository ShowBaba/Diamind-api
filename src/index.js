const { env, port } = require("./config/vars");
const logger = require("./config/logger");
const app = require('./config/express');

// TODO: open db connection here instead

// listen to requests
app.listen(port || 3333, () => {
  logger.info(`Server running on port ${port} in ${env}`)
});

module.exports = app;
