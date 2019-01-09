# MPPTserver
Display the telemetry from the Victron MPPT charge controller and display via web using Nodejs.


## Installation

`cd MPPTserver && npm install`  
 After installation run with `nodemon start` or `node start`.


## Notes
The serial port is called with the /dev/serial/by-id form. Not sure if this is universal to all victron FTDI serial cables. This value must be changed. This project was started with the [vedirect project](https://github.com/Moki38/vedirect) software by [Moki38](https://github.com/Moki38) and changed to meet the specifics of the MPPT series charge controllers. In particular, I have an MPPT 75/15 that I use this with.  


![alt text](/images/screencap.png "Screen Shot")  
