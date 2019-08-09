var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Commercial Mortgage' });
  
});

// make request to mongo db to post loan data

module.exports = router;
