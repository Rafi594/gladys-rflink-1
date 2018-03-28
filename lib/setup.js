var SerialPort = require('serialport');
var Promise = require('bluebird');
var connect = require('./connect.js');
var shared = require('./shared.js');

module.exports = function() {

  // first, we list all connected USB devices
  return listUsbDevices()
    .then(function(ports) {
	
		sails.log.info(`List of available connected Arduinos(pick the name of the one with RFLink and put it -as it is- in the RFLink_tty variable on Gladys):`);
      // we keep only the arduinos
      return filterArduino(ports);
    })
	.then(function(){
		
		//we enable detection
		startConfig();
		//we wait 5 minutes before stopping detection
		setTimeout(stopConfig, 300000);
		return Promise.resolve();
	})
};

function filterArduino(ports) {
  var arduinos = [];

  // foreach port we test if it is an arduino
  ports.forEach(function(port) {
    if ((port.manufacturer && port.manufacturer.toLowerCase().search("arduino") != -1)
      || (port.serialNumber && port.serialNumber.toLowerCase().search("cp2102_usb_to_uart_bridge_controller") != -1)) {
      sails.log.info(`-` + port.comName);
	  arduinos.push(port);
    }
  });

  return Promise.resolve(arduinos);
}

function listUsbDevices() {
  return new Promise(function(resolve, reject) {
    SerialPort.list(function(err, ports) {
      if (err) return reject(new Error(err));

      return resolve(ports);
    });
  });
}

function startConfig(){
	sails.log.info(`RFLink go to learning mode for 5 minutes`);
	shared.setConfEn(true);
}

function stopConfig(){
	sails.log.info(`RFLink return to standard mode`);
	shared.setConfEn(false);
}