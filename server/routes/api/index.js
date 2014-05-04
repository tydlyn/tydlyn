var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/api', function(req, res) {
	res.render('index', { title: 'Welcome to Tydlyn API' });
});

module.exports = router;