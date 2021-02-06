var express = require('express');
var db = require('../database');
var router = express.Router();

/* GET tracker page. */
router.get('/', function(req, res, next) {
	if (req.query.order != null) {
		var msg = {};
		msg['order_id'] = req.query.order;
		if (req.query.payment == "success") {
			msg['message'] = "Payment successful!";
			msg['message_type'] = 'success';
		} else if (req.query.payment == "failure") {
			msg['message'] = "Payment failed!";
			msg['message_type'] = 'error';
		}

		var sql = 'SELECT id, creation_time, status FROM Payments WHERE id = ?;';
		db.query(sql, [req.query.order], function (error, results, fields) {
			if (error) throw error;
			if (results.length == 0) {
				msg['error'] = "Order number not found.";
			} else {
				msg['error'] = "";
				msg['order'] = results;
			}
			res.render('order', msg)
		});

		
  	} else {
  		res.render('tracker', {});
  	}
});

module.exports = router;