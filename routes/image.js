var express = require('express');
var router = express.Router();
var db = require('../database');

/* GET payment page. */
router.get('/', function(req, res, next) {
	if (req.query.user != null) {
		var sql = "SELECT canvasBackground, canvasmessage, " + 
			"canvasMessage, cardMessageFontSize, cardMessageFont, " + 
			"cardMessageFontColor FROM MainTable WHERE id = ?";
		db.query(sql, [req.query.user], function (error, canvasResults, fields) {
			if (error) {
			    console.log(error);
			    throw error;
		  	}
			
			var subSql = "SELECT * FROM UserAssets WHERE main_id = ?";
			db.query(subSql, [req.query.user], function (error, templateResults, fields) {
				if (error) {
					console.log(error);
					throw error;
				}

				console.log(canvasResults);
				res.render('image', {
					'designParams': templateResults,
					'canvasParams': canvasResults
				});
			});
		});
	} else {
		res.render('image', {});
	}
});

module.exports = router;
