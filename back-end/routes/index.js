const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.send('Back-end za POSTU');
});

module.exports = router;
