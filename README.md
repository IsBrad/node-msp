# node-msp
MultiWii serial protocol library specialized for usage with Cleanflight. It should also work with varying degrees of success with BaseFlight, MultiWii and other flight-controllers that support the MultiWii protocol.

The library has no dependencies, for real world usage communication using the serial port would be required. and example of this is included within the [example.js](./example.js) file.

Both deserialization of MSP messages and serialization of messages is supported. Much of the functionality is untested therefore things may not work. Most of the MSP (except a few functions) are implemented.

You will have the look at the code for further documentation unfortunately. I may update this read-me at sometime.

## Syntax
### Basics
The library itself does not handle communication of the serial port (UART). To do this you will need to use a library such as [serialport](https://www.npmjs.com/package/serialport)

```javascript
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

  setInterval(function () {
    var message = msp.send('MSP_MOTOR');
    port.write(message, function (error) {
      //console.log(error);
    });
  }, 200);

  port.on('data', function (data) {
    reader.handleBuffer(data);
  });
});

port.on('close', function () {
  console.log('port closed');
});
```

### Events (inbound messages)
Events are deserialized and emitted from a instance of the reader class within the node-msp module.
```javascript
var reader = new require('node-msp').reader();
```

Data from the serial port needs to be fed into the reader class.
```javascript
var reader = new require('node-msp').reader();
var serialport = require('serialport');;

var port = new serialport.SerialPort('/dev/cu.PL2303-00001014', {
  baudrate : 115200 //Usual baud rate for flight controller
});

port.on('open', function () {
  port.on('data', function (data) {
    //Feed the data in
    reader.handleBuffer(data);
  });
});
```

Two events can be emitted from the reader class. Error and Message.
Messages can are partially abstracted you will have to look at the code or experiment for more details.
```javascript
reader.on('error', function (error) {
  console.log('There was an error - ', error);
});

reader.on('message', function (message) {
  //Will contain the message name (from the ID number and the payload)
  console.log(message);
});
```

### Outbound requests/messages
Messages can be serialized by the module.
```javascript
var reader = new require('node-msp').reader();
var serialport = require('serialport');;

var port = new serialport.SerialPort('/dev/cu.PL2303-00001014', {
  baudrate : 115200 //Usual baud rate for flight controller
});

port.on('open', function () {
  port.on('data', function (data) {
    //Feed the data in
    reader.handleBuffer(data);
  });
});
```

Two events can be emitted from the reader class. Error and Message.
Messages can are partially abstracted you will have to look at the code or experiment for more details.
```javascript
msp.send('MSP_MOTOR');
```

## Supported functions
### Sending
When sending messages either the message id or name can be used. Where messages are sending data to the flight controller payload can be included as the second argument of the send function (this is optional)
```javascript
var payload = {
  motors : [1000, 1000, 1000, 2000]
};
var message = msp.send('MSP_MOTOR', payload);
```
Messages with numbers starting with 1 are messages from the flight controller, requests for these messages require no payload.
Messages beginning with 2 are requests to the flight controller, they will never be received but have a payload when sent.
Supported messages are :
  100. MSP_IDENT
  101. MSP_STATUS
  102. MSP_RAW_IMU
  103. MSP_SERVO
  104. MSP_MOTOR
  105. MSP_RC
  106. MSP_RAW_GPS
  107. MSP_COMP_GPS
  108. MSP_ATTITUDE
  109. MSP_ALTITUDE
  110. MSP_ANALOG
  111. MSP_RC_TUNING
  112. MSP_PID
  114. MSP_MISC
  115. MSP_MOTOR_PINS
  118. MSP_WP
  200. MSP_SET_RAW_RC
  201. MSP_SET_RAW_GPS
  202. MSP_SET_PID
  205. MSP_ACC_CALIBRATION
  206. MSP_MAG_CALIBRATION
  207. MSP_SET_MISC
  208. MSP_RESET_CONF
  209. MSP_SET_WP
  210. MSP_SELECT_SETTING
  211. MSP_SET_HEAD
  214. MSP_SET_MOTOR
  240. MSP_BIND
  250. MSP_EEPROM_WRITE
### Recieving
Messages are decoded as they arrive. Messages will have the name of the command and partially abstracted payload.
### More
More information of MSP messages can be found on the [MultiWii wiki](http://www.multiwii.com/wiki/index.php?title=Multiwii_Serial_Protocol)
