//
// BMV
//
var serialport = require('serialport');

var bmvdata = {};

function get_product_longname(pid) {
    if (pid == "0x203") return("BMV-700");
    if (pid == "0x204") return("BMV-702");
    if (pid == "0x205") return("BMV-700H");
    if (pid == "0x300") return("MPPT 70/15");
    if (pid == "0xA053") return("MPPT 75/15");
    if (pid == "0xA043") return("MPPT 100/15");
    if (pid == "0xA044") return("MPPT 100/30");
    if (pid == "0xA041") return("MPPT 150/35");
    if (pid == "0xA040") return("MPPT 75/50");
    if (pid == "0xA045") return("MPPT 100/50");
    return ("Unknown");
};

function get_error_longname(err) {
    if (err == "0") return("No Error");
    if (err == "2") return("Battery voltage too high");
    if (err == "17") return("Charger temperature too high");
    if (err == "18") return("Charger over current");
    if (err == "19") return("Charger current reversed");
    if (err == "20") return("Bulk time limit exceeded");
    if (err == "21") return("Current sensor issue (sensor bias/sensor broken");
    if (err == "26") return("Terminals overheated");
    if (err == "33") return("Input voltage too high (solar panel)");
    if (err == "34") return("Input current too high (solar panel)");
    if (err == "38") return("Input shutdown (due to excessive battery voltage)");
    if (err == "116") return("Factory calibration data lost");
    if (err == "117") return("Invalid/incompatible firmware");
    if (err == "119") return("User settings invalid");
    return("Unknown");
};

function get_cs_longname(cs) {
    if (cs == "0") return("Off");
    if (cs == "1") return("Low Power");
    if (cs == "2") return("Fault");
    if (cs == "3") return("Bulk");
    if (cs == "4") return("Absorption");
    if (cs == "5") return("Float");
    if (cs == "9") return("Inverting");
    return("Unknown");
};

function parse_serial(line) {
    var res = line.split("\t");

    switch(res[0]) {
        case    'FW':
            bmvdata.FW = res[1]/100;
            break;
        case    'PID':
            bmvdata.PID = res[1];
            bmvdata.PID_LONG = get_product_longname(res[1]);    
            break;
        case    'V':
            bmvdata.V = Math.floor(res[1]/10)/100;
            break;
        case    'I':
            bmvdata.I = Math.floor(res[1]/10)/100;
            break;
        case    'VPV':
            bmvdata.VPV = Math.floor(res[1]/10)/100;
            break;
        case    'PPV':
            bmvdata.PPV = res[1];
            break;
        case    'CS':
            bmvdata.CS = res[1];
            bmvdata.CS_LONG = get_cs_longname(res[1]);
            break;
        case    'ERR':
            bmvdata.ERR = res[1];
            bmvdata.ERR_LONG = get_error_longname(res[1]);
            break;
        case    'LOAD':
            bmvdata.LOAD = res[1];
            break;
        case    'IL':
            bmvdata.IL = res[1]/1000;
            break;
        case    'H19':
            bmvdata.YTot = res[1]/100;
            break
        case    'H20':
            bmvdata.YT = res[1]*10;
            break;
        case    'H21':
            bmvdata.MT = res[1];
            break;
        case    'H22':
            bmvdata.YY = res[1]*10;
            break;
        case    'H23':
            bmvdata.MY = res[1];
            break;
        case    'HSDS':
            bmvdata.Day = res[1];
            break;
    }
}

exports.open = function(ve_port) {
    port =  new serialport(ve_port, {
        baudrate: 19200,
        parser: serialport.parsers.readline('\r\n')});
    port.on('data', function(line) {
        //                   parse_serial(ve_port, line);
        parse_serial(line);
    });

}

exports.update = function() {
    return bmvdata;
}

exports.close = function() {
}

