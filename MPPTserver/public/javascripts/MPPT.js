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
var gLen = 3600;
var timestamp = new Array(gLen).fill(0);
var battV = new Array(gLen).fill(0);
var X = new Array(gLen).fill(0);
var battI = new Array(gLen).fill(0);
var panV = new Array(gLen).fill(0);
var panW = new Array(gLen).fill(0);
i = 0;
while (i < gLen){
    X[i] = i;
    i++;
}
function buildCharts(obj) {
    battI.push(obj.I);
    battV.push(obj.V);
    panV.push(obj.VPV);
    panW.push(obj.PPV);
    var d = new Date();
    timestamp.push(d.toLocaleTimeString());
    i++;
    
    if (battV.length >= gLen) {
        battV.shift();
        //X.shift();
        battI.shift();
        panV.shift();
        panW.shift();
    }

    var battTraceV = {
        type: 'line',
        mode: 'lines',
        name: 'Battery Voltage',
        x: X,
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
        name: 'Battery Current',
        yaxis: 'y2',
        x: X,
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
        name: 'Panel Voltage',
        x: X,
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
        name: 'Panel Power',
        yaxis: 'y2',
        x: X,
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

    Plotly.newPlot('BattPlotDiv', battData, battLayout, {responsive: true, displayModeBar: false });
    Plotly.newPlot('PanPlotDiv', panData, panLayout, {responsive: true, displayModeBar: false });
}
