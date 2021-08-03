const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorization');
const controller = require('../controllers/index');

router
  .route('/')
  .get(authorize, controller.getEntries)
  .post(authorize, controller.createEntry)
  .put((req, res) => {
    res.statusCode = 403; // operation not supported
    res.end('PUT operation not supported on /entries use /entries/:id instead');
  })
  .delete(authorize, controller.deleteAllEntries);

router
  .route('/:id')
  .get(authorize, controller.getEntryById)
  .post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /entries/${req.params.id}`);
  })
  .put(authorize, controller.updateEntry)
  .delete(authorize, controller.deleteOneEntry);

module.exports = router;
