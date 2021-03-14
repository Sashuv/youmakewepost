var express = require('express');
var router = express.Router();
var db = require('../database');

/* POST payment page. */
router.post('/:payment_id/', function(req, res, next) {
	res.render('payment', {
		'success': true, 
		'payment_id': req.params.payment_id,
		'designParams': {
		  	'assets_id': [].concat(req.body.assets_id || []),
		  	'assets_x': [].concat(req.body.assets_x || []),
		  	'assets_y': [].concat(req.body.assets_y || []),
		  	'assets_w': [].concat(req.body.assets_w || []),
		  	'assets_h': [].concat(req.body.assets_h || []),
		  	'assets_type': [].concat(req.body.assets_type || []),
		  	'assets_font': [].concat(req.body.assets_font || []),
		  	'assets_fontSize': [].concat(req.body.assets_fontSize || []),
		  	'assets_fontStyle': [].concat(req.body.assets_fontStyle || []),
		  	'assets_fontWeight': [].concat(req.body.assets_fontWeight || []),
		  	'assets_color': [].concat(req.body.assets_color || []),
		  	'assets_scale': [].concat(req.body.assets_scale || []),
		  	'assets_rotation': [].concat(req.body.assets_rotation || []),
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
			'font': req.body.cardMessageFont,
			'fontSize': req.body.cardMessageFontSize,
			'fontColor': req.body.cardMessageFontColor,
			'fontStyle': req.body.cardMessageFontStyle,
			'fontWeight': req.body.cardMessageFontWeight,
		},
		'canvasMessage': req.body.canvasMessage,
		'singleFormat': req.body.singleFormat
	});
});

/* GET payment page. */
router.get('/', function(req, res, next) {
  // res.redirect('/');
  res.render('payment', {'payment_id': 0});
});

/* POST payment record. */
router.post('/:payment_id/record/', function(req, res, next) {
	var transactionId = req.body.transaction_id;
	var status = (req.body.status == "COMPLETED" ? "Payment Received (Verification Pending)" : "INCOMPLETE");
	var status_id = (req.body.status == "COMPLETED" ? 1 : 0);
	var updateTime = req.body.update_time;
	var paymentId = req.body.payment_id;
	var details = req.body.details;

	var sql = `INSERT INTO Payments (transaction_id, status, update_time, user_id, details, status_id) ` +
			  `VALUES (?, ?, ?, ?, ?, ?)`;

	db.query(sql, 
		[transactionId, status, updateTime, paymentId, details, status_id],
		function (error, results, fields) {
			if (error) {
				res.status(400);
			}
			res.json({'success': true, 'orderNumber': paymentId});
		}
	);
});

module.exports = router;
