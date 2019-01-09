var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var vedirect = require('./js/index.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);



/* ------------------------------------------------------/
/   Start serial service and stream data to eventStream  /
/-------------------------------------------------------*/
var streamClientID = 0;
var streamClients = {};

app.get("/stream/", function(req, res){
    req.socket.setTimeout(Number.MAX_VALUE);
    res.writeHead(200, {
        'Content-Type': 'text/event-stream', // <- Important headers
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');
    (function (streamClientID) {
        streamClients[streamClientID] = res; // <- Add this client to those we consider "attached"
        req.on("close", function () {
            delete streamClients[streamClientID]
        }); // <- Remove this client when he disconnects
    })(++streamClientID)
});

function MPPT_stream(msg) {
    for (streamClientID in streamClients) {
        streamClients[streamClientID].write("data: " + JSON.stringify(msg) + "\n\n"); // <- Push a message to a single attached client
    };

}
vedirect.open('/dev/serial/by-id/usb-VictronEnergy_BV_VE_Direct_cable_VE1BOJF3-if00-port0');
console.log('Serial Opened');
var displayinterval = setInterval(function () {
    MPPTdata = vedirect.update();
    MPPT_stream(MPPTdata);
}, 500);


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
