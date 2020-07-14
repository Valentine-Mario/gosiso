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
var balanceHistoryRouter=require('./routes/balance_history')
var wayBillRouter=require('./routes/waybill')

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const rateLimit = require("express-rate-limit");
 
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
 app.set('trust proxy', 1);
 
const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, 
  max: 5 ,
  message:"Three trials exceeded, try again after 5 minutes",
  statusCode:206,
      handler: function (req, res, next) {
        res.removeHeader('X-Powered-By');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-DNS-Prefetch-Control', 'off');
        res.setHeader('X-Download-Options', 'noopen');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');

        // CORS
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Send this response for rate limited requests
        res.status(this.statusCode!).send(this.message);
      }
});
 
//  apply to all requests
app.use('/user/login', limiter);
app.use('/admin/login', limiter)

app.use(function(req, res, next) {
  
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();

});

// view engine setup
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', '.hbs');
 
var url=process.env.MONDODB_CLOUD
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
app.use('/balancehistory', balanceHistoryRouter)
app.use('/waybill', wayBillRouter);

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
