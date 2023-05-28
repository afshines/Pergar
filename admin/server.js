var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var MyRss = require("./rss")

require("dotenv").config();

var mongoose = require("mongoose");

const passport = require("passport");

var mongoDB = process.env.MONGO_URI;
//var mongoDB = "mongodb://localhost:27017/dbname";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true});


//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

require("./authentication/passport");

var indexRouter = require("./routers/index");
var apiRouter = require("./routers/api");
var authenticationRouter = require("./routers/authentication");
var newsRouter = require("./routers/news");
var mediaRouter = require("./routers/media");
var media_all = require("./routers/media_all");
var rssRouter = require("./routers/rss");
var feedRouter = require("./routers/feed");
var meRouter = require("./routers/me");

const bodyParser = require("body-parser");
var cors = require("cors");
var app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"), {
  maxAge: 3600000,
  cacheControl: true, setHeaders: function (res, path) {
    res.setHeader("Cache-Control", "max-age=99999,must-revalidate");
  }
}));

app.use("/", indexRouter);

app.use("/authentication", authenticationRouter);
app.use("/me", passport.authenticate("operator-rule", { session: false }), meRouter);
app.use("/news", passport.authenticate("operator-rule", { session: false }), newsRouter);
app.use("/feed", passport.authenticate("operator-rule", { session: false }), feedRouter);
app.use("/media", passport.authenticate("admin-rule", { session: false }), mediaRouter);
app.use("/rss", passport.authenticate("admin-rule", { session: false }), rssRouter);
app.use("/media_all", passport.authenticate("operator-rule", { session: false }), media_all);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


///upload 
app.use(express.static('./public', {
  maxAge: '5000000' // uses milliseconds per docs
}));
//app.use('/static',express.static('./public'));
app.use(bodyParser.json({ limit: '500mb', extended: true }));
app.use(bodyParser.urlencoded({
  limit: '500mb', extended: true, parameterLimit: 500000,
  type: 'application/x-www-form-urlencoded'
}));

///////////////////////////////////////Server/////////////////////


var debug = require('debug')('newsbox:server');
var http = require('http');
//const fs = require('fs')

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);



/**
 * Create HTTP server.
 */
// const httpsOptions = {
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);



MyRss.fetchAndStoreRSS();
setInterval(MyRss.fetchAndStoreRSS, 10 * 60 * 1000);



/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
