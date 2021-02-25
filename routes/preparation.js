var express = require('express');
var router = express.Router();
var db = require('../database');

/* GET preparation page. */
router.get('/', function(req, res, next) {
	if (req.query.design != null) {
		var sql = `SELECT * FROM TemplateAssets WHERE template_id = ?`;
		db.query(sql, [req.query.design], function (error, results, fields) {
  		if (error) {
        console.log(error);
        throw error;
      }
  		res.render('preparation', {'designParams': results});
  	});
	} else {
  	res.render('preparation', {});
	}
});

/* GET preparation page. */
router.post('/savedb', function(req, res, next) {
  var senderFirstName = req.body.senderFirstName;
  var senderLastName = req.body.senderLastName;
  var senderAddress = req.body.senderAddress;
  var senderAddress2 = req.body.senderAddress2;
  var senderCity = req.body.senderCity;
  var senderState = req.body.senderState;
  var senderZip = req.body.senderZip;
  var recieverFirstName = req.body.recieverFirstName;
  var recieverLastName = req.body.recieverLastName;
  var recieverAddress = req.body.recieverAddress;
  var recieverAddress2 = req.body.recieverAddress2;
  var recieverCity = req.body.recieverCity;
  var recieverState = req.body.recieverState;
  var recieverZip = req.body.recieverZip;
  var cardMessageFont = req.body.cardMessageFont;
  var cardMessageFontSize = req.body.cardMessageFontSize;
  var cardMessageFontColor = req.body.cardMessageFontColor;
  var canvasBackground = req.body.canvasBackground;
  var canvasMessage = req.body.canvasMessage;

  var sql = "INSERT INTO MainTable (senderFirstName, senderLastName, senderAddress, senderAddress2, " +
            "senderCity, senderState, senderZip, recieverFirstName, recieverLastName, " +
            "recieverAddress, recieverAddress2, recieverCity, recieverState, recieverZip, " +
            "canvasBackground, canvasMessage, cardMessageFont, cardMessageFontSize, cardMessageFontColor) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(sql, [senderFirstName,
      senderLastName,
      senderAddress,
      senderAddress2,
      senderCity,
      senderState,
      senderZip,
      recieverFirstName,
      recieverLastName,
      recieverAddress,
      recieverAddress2,
      recieverCity,
      recieverState,
      recieverZip,
      canvasBackground,
      canvasMessage,
      cardMessageFont,
      cardMessageFontSize,
      cardMessageFontColor], function (error, results, fields) {
  	if (error) throw error;
  	let insertId = results.insertId;
    let groupId = results.insertId % 2;

    if (typeof(req.body.assets_id) != "undefined") {
      var subSql = "INSERT INTO UserAssets (main_id, content, x, y, w, h, scale, rotation, " +
                   "group_id, type, font, fontsize, fontColor) VALUES ";
      var subSqlParams = [];

      if (typeof(req.body.assets_id) != "string") {
        for (let i=0; i < req.body.assets_id.length; i++) {
          subSql += "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
          if (i != req.body.assets_id.length - 1) {
            subSql += ", ";
          }
          subSqlParams.push(insertId);
          subSqlParams.push(req.body.assets_id[i]);
          subSqlParams.push(parseInt(req.body.assets_x[i]));
          subSqlParams.push(parseInt(req.body.assets_y[i]));
          subSqlParams.push(parseInt(req.body.assets_w[i]));
          subSqlParams.push(parseInt(req.body.assets_h[i]));
          if (req.body.assets_type[i] == 'img') {
            subSqlParams.push(req.body.assets_scale[i]);
            subSqlParams.push(req.body.assets_rotation[i]);
          } else {
            subSqlParams.push(1);
            subSqlParams.push(0);
          }
          subSqlParams.push(groupId);

          subSqlParams.push(req.body.assets_type[i]);
          if (req.body.assets_type[i] == 'txt') {
            subSqlParams.push(req.body.assets_font[i]);
            subSqlParams.push(req.body.assets_fontSize[i]);
            subSqlParams.push(req.body.assets_color[i]);
          } else {
            subSqlParams.push('');
            subSqlParams.push(0);
            subSqlParams.push('');
          }
        }
      } else {
        subSql += "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        subSqlParams.push(insertId);
        subSqlParams.push(req.body.assets_id);
        subSqlParams.push(parseInt(req.body.assets_x));
        subSqlParams.push(parseInt(req.body.assets_y));
        subSqlParams.push(parseInt(req.body.assets_w));
        subSqlParams.push(parseInt(req.body.assets_h));
        if (req.body.assets_type == 'img') {
            subSqlParams.push(req.body.assets_scale);
            subSqlParams.push(req.body.assets_rotation);
          } else {
            subSqlParams.push(1);
            subSqlParams.push(0);
          }
          subSqlParams.push(groupId);

          subSqlParams.push(req.body.assets_type);
          if (req.body.assets_type[i] == 'txt') {
            subSqlParams.push(req.body.assets_font);
            subSqlParams.push(req.body.assets_fontSize);
            subSqlParams.push(req.body.assets_color);
          } else {
            subSqlParams.push('');
            subSqlParams.push(0);
            subSqlParams.push('');
          }
      }

      db.query(subSql, subSqlParams, function (error, results) {
        if (error) throw error;
        res.redirect(307, '/payment/' + insertId);
      });
  	} else {
  		res.redirect(307, '/payment/' + insertId);
  	}
	});
});

module.exports = router;
