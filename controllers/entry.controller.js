/* eslint-disable arrow-parens */
/* eslint-disable no-shadow */
const models = require('../db/models');

const { Entry } = models;

exports.getEntries = (req, res, next) => {
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
          entries,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.createEntry = (req, res, next) => {
  const { id } = req.decoded;
  if (Array.isArray(req.body)) {
    // eslint-disable-next-line no-return-assign
    req.body.forEach((obj) => obj.userId = id);
    Entry.bulkCreate(req.body)
      .then(
        (entry) => {
          res.statusCode = 200;
          // res.setHeader('Content-Type', 'application/json');
          res.json({
            message: 'Created new entries',
            data: entry,
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  } else {
    req.body.userId = id;
    Entry.create(req.body)
      .then(
        (entry) => {
          res.statusCode = 200;
          // res.setHeader('Content-Type', 'application/json');
          res.json({
            message: 'Created a new entry',
            data: entry,
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
};

exports.deleteAllEntries = (req, res, next) => {
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
};

exports.getEntryById = (req, res, next) => {
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
};

exports.updateEntry = (req, res, next) => {
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
                  data: entry
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
};

exports.deleteOneEntry = (req, res, next) => {
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
};
