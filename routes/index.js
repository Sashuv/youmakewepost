var express = require('express');
var router = express.Router();
var db = require('../database');

/* GET index page. */
router.get('/', function(req, res, next) {
  // var sql = 'SELECT id, image_path FROM Template LIMIT 8;';
  // db.query(sql, function (error, results, fields) {
  // 	if (error) throw error;

  // 	var msg = {'templates': results};
  // 	if (typeof req.query.payment != undefined) {
  // 		if (req.query.payment == "success") {
  // 			msg['message'] = "Payment successful!";
  // 			msg['message_type'] = 'success';
  // 		} else if (req.query.payment == "failure") {
  // 			msg['message'] = "Payment failed!";
  // 			msg['message_type'] = 'error';
  // 		}
  // 	}
  // 	res.render('index', msg);
  // });

  var msg = {};
  if (typeof req.query.payment != undefined) {
	if (req.query.payment == "success") {
		msg['message'] = "Payment successful!";
		msg['message_type'] = 'success';
	} else if (req.query.payment == "failure") {
		msg['message'] = "Payment failed!";
		msg['message_type'] = 'error';
	}
  }
  
  res.render('index', msg);
});


module.exports = router;
