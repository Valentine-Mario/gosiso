var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose=require('mongoose')
require('dotenv').config()
var timeout = require('express-timeout-handler');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var courierRouter=require('./routes/courier');
var adminRouter=require('./routes/admin')
var bankRouter=require('./routes/banks')
var notificationRouter=require('./routes/notification')
var cardRouter=require('./routes/cards')
var paymenyRouter=require('./routes/payment')
var balanceHistory=require('./routes/balance_history')

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
  
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();

});

// view engine setup
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', '.hbs');
 
var url=process.env.MONGODB_DEV
mongoose.Promise= global.Promise;
mongoose.connect(url, { useNewUrlParser: true }).catch((error) => { console.log(error); });
var options = {
  timeout: 120000,
 
  onTimeout: function(req, res) {
    res.status(205).json({sucess:false, message:"service timed out"});
  },
 
};

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/courier', courierRouter);
app.use('/admin', adminRouter);
app.use('/bank', bankRouter) 
app.use('/notif', notificationRouter)
app.use('/card', cardRouter)
app.use('/payment', paymenyRouter)
app.use('/balancehistory', balanceHistory)

app.use(timeout.handler(options));

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
