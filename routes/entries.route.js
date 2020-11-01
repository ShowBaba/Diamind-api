/* eslint-disable no-shadow */
const express = require('express');
const bodyParser = require('body-parser');
const models = require('../models');

const { Entry } = models;
const authorize = require('../middlewares/authorization');

const entryRouter = express.Router();

entryRouter.use(bodyParser.json());

entryRouter
  .route('/')
  .get(authorize, (req, res, next) => {
    const { id } = req.decoded;
    Entry.findAll({
      where: {
        userId: id,
      }
    })
      .then(
        (entries) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            message: 'Diary Entries',
            entries
            ,
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
  )
  .post(authorize, (req, res, next) => {
    const { id } = req.decoded;
    const { content } = req.body;
    Entry.create({ content, userId: id })
      .then(
        (entry) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            message: 'Created a new entry',
            data: entry,
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403; // operation not supported
    res.end('PUT operation not supported on /entries use /entries/:id instead');
  })
  .delete(authorize, (req, res, next) => {
    const { id } = req.decoded;
    Entry.destroy({
      where: {
        userId: id,
      }
    })
      .then(
        (response) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            message: 'Entries Deleted',
            response,
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

entryRouter
  .route('/:id')
  .get(authorize, (req, res, next) => {
    const { id } = req.decoded;
    Entry.findByPk(req.params.id)
      .then(
        (entry) => {
          if (!entry) {
            res.statusCode = 400;
            res.end('Resource not found');
          }
          if (id === entry.userId) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              message: 'Entry',
              data: entry,
            });
          } else {
            res.statusCode = 401;
            res.end('You are not authorized to access this resource');
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /entries/${req.params.id}`);
  })
  .put(authorize, (req, res, next) => {
    const { id } = req.decoded;
    Entry.findByPk(req.params.id)
      .then(
        (entry) => {
          if (!entry) {
            res.statusCode = 400;
            res.end('Resource not found');
          } else if (id === entry.userId) {
            entry.update(
              { content: req.body.content },
              { where: { id: req.params.id } }
            )
              .then(
                (entry) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({
                    message: 'Entry Updated',
                    entry
                  });
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          } else {
            res.statusCode = 403;
            res.end('You are not authorized to perform this operation');
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authorize, (req, res, next) => {
    const { id } = req.decoded;
    Entry.findByPk(req.params.id)
      .then(
        (entry) => {
          if (!entry) {
            res.statusCode = 400;
            res.end('Resource not found');
          } else if (id === entry.userId) {
            Entry.destroy({
              where: {
                id: req.params.id,
              }
            })
              .then(
                (response) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({
                    message: 'Entry Deleted',
                    response,
                  });
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          } else {
            res.statusCode = 403;
            res.end('You are not authorized to perform this operation');
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = entryRouter;
