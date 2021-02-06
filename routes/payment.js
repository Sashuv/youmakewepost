var express = require('express');
var router = express.Router();
var db = require('../database');

/* POST payment page. */
router.post('/:payment_id/', function(req, res, next) {
  res.render('payment', {
  	'success': true, 
  	'payment_id': req.params.payment_id,
  	'designParams': {
	  	'assets_id': req.body.assets_id,
	  	'assets_x': req.body.assets_x,
	  	'assets_y': req.body.assets_y,
	  	'assets_w': req.body.assets_w,
	  	'assets_h': req.body.assets_h,
	  	'assets_scale': req.body.assets_scale,
	  	'assets_rotation': req.body.assets_rotation,
	  	'canvasBackground': req.body.canvasBackground
  	},
  	'recieverFirstName': req.body.recieverFirstName,
  	'recieverLastName': req.body.recieverLastName,
  	'recieverAddress': req.body.recieverAddress,
  	'recieverAddress2': req.body.recieverAddress2,
  	'recieverCity': req.body.recieverCity,
  	'recieverState': req.body.recieverState,
  	'recieverZip': req.body.recieverZip,
  	'textProp': {
  		'font': req.body.messageFont,
  		'fontSize': req.body.fontSize
	},
	'canvasMessage': req.body.canvasMessage,
  });
});

/* GET payment page. */
router.get('/', function(req, res, next) {
  // res.redirect('/');
  res.render('payment', {'payment_id': 0});
});

/* POST payment record. */
router.post('/:payment_id/record/', function(req, res, next) {
	var creationTime = req.body.creation_time;
	var transactionId = req.body.transaction_id;
	var status = req.body.status;
	var updateTime = req.body.update_time;
	var paymentId = req.body.payment_id;
	var details = req.body.details;

	var sql = `INSERT INTO Payments (creation_time,  transaction_id, status, update_time, user_id, details) ` +
			  `VALUES (?, ?, ?, ?, ?, ?)`;

	db.query(sql, 
		[creationTime, transactionId, status, updateTime, paymentId, details],
		function (error, results, fields) {
			if (error) throw error;
			let orderNumber = results.insertId;
			res.json({'success': true, 'orderNumber': orderNumber});
		}
	);
});

module.exports = router;
