//Flight controller motor test!!! remove props before running this!
//Arming is set up on high end of aux 2

var msp = require('node-msp');
var reader = new msp.reader();

var serialport = require('serialport');

var portLocation = '/dev/cu.PL2303-00001014'; //Path to serialport

var port = new serialport.SerialPort(portLocation, {
  baudrate : 115200 //Usual baud rate for flight controller
});

reader.on('error', function (error) {
  console.log('There was an error - ', error);
});

reader.on('message', function (message) {
  console.log(message);
});

port.on('open', function () {
  console.log('port connected');

  var controller = {
    throttle : 1000,
    aux : [1000, 1900]
  };

  /*setInterval(function () {
    var message = msp.send('MSP_MOTOR');
    port.write(message, function (error) {
      //console.log(error);
    });
  }, 200);*/

  setInterval(function () {
    var message = msp.send('MSP_SET_RAW_RC', controller);
    port.write(message, function (error) {
      //console.log(controller.throttle);
      //console.log('Sent');
    });
  }, 30);

  setTimeout(function () {
    console.log('startup');
    controller.aux[1] = 1900;
    controller.throttle = 1300;
  }, 1000);

  setTimeout(function () {
    console.log('shutdown');
    controller.aux[1] = 1000;
    controller.throttle = 1000;
  }, 3000);

  var parsing = 'header';
  var position = 0;
  var messageLength;
  var xor = undefined;

  var message = {
    id : undefined,
    parts : []
  };

  port.on('data', function (data) {
    reader.handleBuffer(data);
  });
});

port.on('close', function () {
  console.log('port closed');
});
