var express = require('express');
var router = express.Router();
var db = require('../database');

/* POST payment page. */
router.post('/:payment_id/', function(req, res, next) {
  res.render('payment', {
  	'success': true, 
  	'payment_id': req.params.payment_id
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
			res.json({'success': true});
		}
	);
});

module.exports = router;
