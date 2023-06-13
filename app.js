var http = require("http");
var fs = require("fs");
var index = fs.readFileSync("index.html");

var SerialPort = require("serialport");
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimiter: "\r\n",
});

//how to get SerialPort path:
//1. Open Arduino IDE
//2. Go to Tools > Port
//3. See which port is checked
//4. Copy the port name and paste it below
//5. If you are using Windows, change the port name to the format below

var port = new SerialPort("COM5", {
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

port.pipe(parser);

var app = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(index);
});

var io = require("socket.io").listen(app);

io.on("connection", function (socket) {
  console.log("Node is listening to port");
});

parser.on("data", function (data) {
  console.log("Received data from port: " + data);

  io.emit("data", data);
});

app.listen(3000);
