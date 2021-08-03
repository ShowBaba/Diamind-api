const router = require('express').Router();

const userRoutes = require('./users.route');
const entryRouter = require('./entries.route');
const homeRouter = require('./home.route');
// const { router } = require('../../app');

router.use('/users', userRoutes);
router.use('/entries', entryRouter);
router.use('/', homeRouter);

module.exports = router;