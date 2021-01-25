var express = require('express');
var router = express.Router();
var db = require('../database');

/* GET assets. */
router.get('/', function(req, res, next) {
  let search_query = req.query.search;
  if (search_query != null) {
  	search_query = search_query.toLowerCase().replace(/%20/g, " ");
		var sql = 'SELECT path FROM ASSETS WHERE keywords LIKE ?';
		db.query(sql, [`%${search_query}%`], function (error, results, fields) {
  		if (error) throw error;
  		res.json(results);
  	});
  } else {
  	res.json("");
  }
});

module.exports = router;
