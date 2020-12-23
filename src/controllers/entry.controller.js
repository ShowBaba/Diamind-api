/* eslint-disable arrow-parens */
/* eslint-disable no-shadow */
const models = require('../db/models');

const { Entry } = models;

exports.getEntries = async (req, res, next) => {
  const { id } = req.decoded;
  try {
    const entries = await Entry.findAll({
      where: {
        userId: id,
      },
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      message: 'Diary Entries',
      entries,
    });
  } catch (error) {
    next(error);
  }
};

exports.createEntry = async (req, res, next) => {
  const { id } = req.decoded;
  try {
    if (Array.isArray(req.body)) {
      // eslint-disable-next-line no-return-assign
      req.body.forEach((obj) => (obj.userId = id));
      const bulkEntries = await Entry.bulkCreate(req.body);
      res.statusCode = 201;
      res.json({
        message: 'Created new entries',
        data: bulkEntries,
      });
    } else {
      req.body.userId = id;
      const entry = await Entry.create(req.body);
      res.statusCode = 201;
      res.json({
        message: 'Created a new entry',
        data: entry,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteAllEntries = async (req, res, next) => {
  const { id } = req.decoded;
  try {
    const response = await Entry.destroy({
      where: {
        userId: id,
      },
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      message: 'Entries Deleted',
      response,
    });
  } catch (error) {
    next(error);
  }
};

exports.getEntryById = async (req, res, next) => {
  const { id } = req.decoded;
  try {
    const entry = await Entry.findByPk(req.params.id);
    if (!entry) {
      res.statusCode = 400;
      res.end('Resource not found');
    } else if (id === entry.userId) {
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
  } catch (error) {
    next(error);
  }
};

exports.updateEntry = async (req, res, next) => {
  const { id } = req.decoded;
  try {
    const entry = await Entry.findByPk(req.params.id);
    if (!entry) {
      res.statusCode = 400;
      res.end('Resource not found');
    } else if (id === entry.userId) {
      await entry
        .update(
          { content: req.body.content },
          { where: { id: req.params.id } }
        );
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        message: 'Entry Updated',
        data: entry,
      });
    } else {
      res.statusCode = 403;
      res.end('You are not authorized to perform this operation');
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteOneEntry = async (req, res, next) => {
  const { id } = req.decoded;
  try {
    const entry = await Entry.findByPk(req.params.id);
    if (!entry) {
      res.statusCode = 400;
      res.end('Resource not found');
    } else if (id === entry.userId) {
      const response = await Entry.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        message: 'Entry Deleted',
        response,
      });
    } else {
      res.statusCode = 403;
      res.end('You are not authorized to perform this operation');
    }
  } catch (error) {
    next(error);
  }
};
