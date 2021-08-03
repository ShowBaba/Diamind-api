const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to myDiary Home Route' });
});

router.use((req, res) => {
  return res.status(302).json({
    message: 'Check docs for proper routing'
  })
})

module.exports = router;
