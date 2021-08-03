const redis = require('redis');
const logger = require('../../config/logger')

const REDIS_PORT = process.env.REDIS_PORT
const rclient = redis.createClient(REDIS_PORT)

rclient.on('connect', function (err, response) {
    console.log("Redis Connected");
});

//log error to the console if any occurs
rclient.on("error", (err) => {
  logger.info(err);
});

module.exports = rclient;