function parse(obj) {
    document.getElementById("header").innerHTML = `<h2>${obj.PID_LONG}</h2>     <h4>Firmware: ${obj.FW}</h4>`;
    document.getElementById("battV").innerHTML = obj.V + " V";
    document.getElementById("battI").innerHTML = obj.I + " A";
    document.getElementById("chargeState").innerHTML = obj.CS_LONG;
    document.getElementById("panelV").innerHTML = obj.VPV + " V";
    document.getElementById("panelW").innerHTML = obj.PPV + " W";
    document.getElementById("error").innerHTML = obj.ERR_LONG;
    document.getElementById("loadState").innerHTML = obj.LOAD;
    document.getElementById("loadI").innerHTML = obj.IL + " A";
    document.getElementById("yieldTot").innerHTML = obj.YTot + " kWh";
    document.getElementById("yieldTod").innerHTML = obj.YT + " Wh";
    document.getElementById("yieldYes").innerHTML = obj.YY + " Wh";
    document.getElementById("maxTod").innerHTML = obj.MT + " W";
    document.getElementById("maxYes").innerHTML = obj.MY + " W";
    document.getElementById("days").innerHTML = obj.Day;
}

var timestamp = [];
var battV = [];
var battX = [];
var battI = [];
var panV = [];
var panW = [];
i = 0;
function buildCharts(obj) {

    if (battV.length >= 172800) {
        battV.shift();
        battX.shift();
        battI.shift();
        panV.shift();
        panW.shift();
    }
    battI.push(obj.I);
    battV.push(obj.V);
    panV.push(obj.VPV);
    panW.push(obj.PPV);

    battX.push(i);
    i++;

    var battTraceV = {
        type: 'line',
        mode: 'lines',
        x: battX,
        y: battV,
        marker: {
            color: '#0054b3',
            line: {
                width: 2.5
            }
        }
    };

    var battTraceI = {
        type: 'line',
        mode: 'lines',
        yaxis: 'y2',
        x: battX,
        y: battI,
        marker: {
            color: '#e5ffFF',
            line: {
                width: 2.5
            }
        }
    };

    var panTraceV = {
        type: 'line',
        mode: 'lines',
        x: battX,
        y: panV,
        marker: {
            color: '#0054b3',
            line: {
                width: 2.5
            }
        }
    };

    var panTraceW = {
        type: 'line',
        mode: 'lines',
        yaxis: 'y2',
        x: battX,
        y: panW,
        marker: {
            color: '#e5ffFF',
            line: {
                width: 2.5
            }
        }
    };

    var battData = [ battTraceV, battTraceI ];
    var panData = [ panTraceV, panTraceW ];

    var battLayout = { 
        title: 'Battery Information',
        font: {family: 'xray', color: '#ddf0ff', size: 14},
        paper_bgcolor: '#0074d3',
        plot_bgcolor: '#80b3ff',
        xaxis: {
            title: 'Time',
        },
        yaxis: {
            title: 'Battery Voltage',
            range: [0, 18]
        },
        yaxis2: {
            title: 'Battery Current',
            overlaying: 'y',
            side: 'right',
            range: [-4, 15]
        }
    };

    var panLayout = { 
        title: 'Solar Panel Information',
        font: {family: 'xray', color: '#ddf0ff', size: 14},
        paper_bgcolor: '#0074d3',
        plot_bgcolor: '#80b3ff',
        xaxis: {
            title: 'Time',
        },
        yaxis: {
            title: 'Panel Voltage',
            range: [0, 24]
        },
        yaxis2: {
            title: 'Panel Power',
            overlaying: 'y',
            side: 'right',
            range: [-2, 105]
        }
    };

    Plotly.newPlot('BattPlotDiv', battData, battLayout, {responsive: true});
    Plotly.newPlot('PanPlotDiv', panData, panLayout, {responsive: true});
}
