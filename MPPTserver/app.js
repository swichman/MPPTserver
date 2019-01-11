var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var vedirect = require('./js/parseMPPT.js');
var sqlite3 = require('sqlite3').verbose();

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
/   Create database and load it with streaming data      /
/-------------------------------------------------------*/
var db
function createDB() {
    db = new sqlite3.Database('db/VE.Direct_MPPT.db', createTable);
}

function createTable() {
    db.run('CREATE TABLE if not exists mppt (year INT, month INT, day INT, hour INT, minute INT, second INT, fw FLOAT, pid INT, v FLOAT, i FLOAT, vpv FLOAT, ppv INT, cs INT, err INT, load TEXT, il FLOAT, yTot FLOAT, yt INT, yy INT, mt INT, my INT, runDay INT)');
}

function insertTableData(obj) {
    var ins = db.prepare('INSERT INTO mppt VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    //                                             1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2
    var d = new Date()
    //ts = d.toLocaleTimeString();
    y = d.getFullYear();
    m = d.getMonth() + 1;
    day = d.getDate();
    hours = d.getHours();
    minutes = d.getMinutes();
    seconds = d.getSeconds();
    ins.run(
        y,
        m,
        day,
        hours,
        minutes,
        seconds,
        obj.FW,
        obj.PID,
        obj.V,
        obj.I,
        obj.VPV,
        obj.PPV,
        obj.CS,
        obj.ERR,
        obj.LOAD,
        obj.IL,
        obj.YTot,
        obj.YT,
        obj.YY,
        obj.MT,
        obj.MY,
        obj.Day
    )
}

createDB()
app.get('/query',(req,res) => {
    console.log(req.query);
    db.all(
        'SELECT * FROM mppt WHERE day=$day',
        { $day: req.query.day },
        (err, rows) => {
            if (rows.length > 0)
                res.send(rows);
            else 
                res.send('<h1>INVALID QUERY</h1>');
        }
    );
});


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
var count = 0;
var displayinterval = setInterval(function () {
    MPPTdata = vedirect.update();
    MPPT_stream(MPPTdata);
    if (count % 5 == 0)
        insertTableData(MPPTdata);
    count++
}, 1000);


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
