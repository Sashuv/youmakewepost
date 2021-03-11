var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer  = require('multer');

var indexRouter = require('./routes/index');
var paymentRouter = require('./routes/payment');
var preparationRouter = require('./routes/preparation');
var assetsRouter = require('./routes/assets');
var helpRouter = require('./routes/howto');
var contactRouter = require('./routes/contact');
var aboutRouter = require('./routes/about');
var trackerRouter = require('./routes/tracker');
// var adminRouter = require('./routes/admin');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
app.use('/payment', paymentRouter);
app.use('/preparation', preparationRouter);
app.use('/assets', assetsRouter);
app.use('/howto', helpRouter);
app.use('/contact', contactRouter);
app.use('/about', aboutRouter);
app.use('/tracker', trackerRouter);
// app.use('/admin', adminRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
