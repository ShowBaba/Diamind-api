/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Entries = require('../models/entry.model');

const entryRouter = express.Router();

entryRouter.use(bodyParser.json());

entryRouter
  .route('/')
  .get(authenticate.varifyUser, (req, res, next) => {
    Entries.find({
      user: {
        _id: req.user._id,
      },
    })
      .then(
        (entries) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(entries);
        },
        (err) => next(err),
      )
      .catch((err) => next(err));
  })
  .post(authenticate.varifyUser, (req, res, next) => {
    req.body.user = req.user._id;
    Entries.create(req.body)
      .then(
        (entry) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(entry);
        },
        (err) => next(err),
      )
      .catch((err) => next(err));
  })
  .put(authenticate.varifyUser, (req, res) => {
    res.statusCode = 403; // operation not supported
    res.end('PUT operation not supported on /entries use /entries/:id instead');
  })
  .delete(authenticate.varifyUser, (req, res, next) => {
    Entries.deleteMany({
      user: {
        _id: req.user._id,
      },
    })
      .then(
        (response) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(response);
        },
        (err) => next(err),
      )
      .catch((err) => next(err));
  });

entryRouter
  .route('/:id')
  .get(authenticate.varifyUser, (req, res, next) => {
    Entries.findById(req.params.id)
      .then(
        (entry) => {
          if (req.user._id.equals(entry.user)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(entry);
          } else {
            res.statusCode = 403;
            res.end('You are not authorized to perform this operation');
          }
        },
        (err) => next(err),
      )
      .catch((err) => next(err));
  })
  .post(authenticate.varifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /entries/${req.params.id}`);
  })
  .put(authenticate.varifyUser, (req, res, next) => {
    Entries.findById(req.params.id)
      .then(
        (entry) => {
          if (req.user._id.equals(entry.user)) {
            Entries.findByIdAndUpdate(
              req.params.id,
              { $set: req.id },
              { new: true },
            )
              .then(
                (post) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(post);
                },
                (err) => next(err),
              )
              .catch((err) => next(err));
          } else {
            res.statusCode = 403;
            res.end('You are not authorized to perform this operation');
          }
        },
        (err) => next(err),
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.varifyUser, (req, res, next) => {
    Entries.findById(req.params.id)
      .then(
        (entry) => {
          if (req.user._id.equals(entry.user)) {
            Entries.findByIdAndRemove(req.params.id)
              .then(
                (response) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(response);
                },
                (err) => next(err),
              )
              .catch((err) => next(err));
          } else {
            res.statusCode = 403;
            res.end('You are not authorized to perform this operation');
          }
        },
        (err) => next(err),
      )
      .catch((err) => next(err));
  });

module.exports = entryRouter;
