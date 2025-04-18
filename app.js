var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors=require("cors");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoryRouter=require("./routes/category");
var brandsRouter=require("./routes/brands");
var productsRouter=require("./routes/products");
var productDetailsRouter=require("./routes/productdetails");
var catBannerRouter=require("./routes/categorybanner");
var bannerRouter=require("./routes/banner");
var adminRouter=require("./routes/admins");
var userInterfaceRouter=require("./routes/userinterface");
var userAccountRouter=require("./routes/useraccount");
// var pdfRouter = require('./routes/pdf');


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/pdfs", express.static(path.join(__dirname, "pdfs")));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/category", categoryRouter);
app.use("/brands", brandsRouter);
app.use("/products", productsRouter);
app.use("/productdetails", productDetailsRouter);
app.use("/categorybanner", catBannerRouter);
app.use("/banner", bannerRouter);
app.use("/admins", adminRouter);
app.use("/userinterface", userInterfaceRouter);
app.use("/useraccount", userAccountRouter);
// app.use("/pdf", pdfRouter);


// catch 404 and forward to error andler
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
