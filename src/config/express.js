const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const redis = require('redis')
const error = require("../api/middlewares/error");
const routes = require("../api/routes");
const logger = require("./logger");

dotenv.config();

const app = express();

// eslint-disable-next-line no-unused-vars
const whitelist = ['http://localhost:3333'];

const corsOptions = {
  origin: "*"
};

// app middlewaress
// helmet for standard security
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// mount routes
app.use("/api/v1", routes);

// error handler middlewares
app.use(error.converter);
app.use(error.notFound);
app.use(error.handler);

module.exports = app;