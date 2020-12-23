const express = require('express');
const bodyParser = require('body-parser');
const authorize = require('../middlewares/authorization');

const controller = require('../controllers/index');

const entryRouter = express.Router();

entryRouter.use(bodyParser.json());

entryRouter
  .route('/')
  .get(authorize, controller.getEntries)
  .post(authorize, controller.createEntry)
  .put((req, res) => {
    res.statusCode = 403; // operation not supported
    res.end('PUT operation not supported on /entries use /entries/:id instead');
  })
  .delete(authorize, controller.deleteAllEntries);

entryRouter
  .route('/:id')
  .get(authorize, controller.getEntryById)
  .post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /entries/${req.params.id}`);
  })
  .put(authorize, controller.updateEntry)
  .delete(authorize, controller.deleteOneEntry);

module.exports = entryRouter;
