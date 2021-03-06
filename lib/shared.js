var ports = [];
var conf_enabled = false;
var connect = require('./connect.js');
var Promise = require('bluebird');

module.exports = {

  addPort: function(newPort)  {
    ports.push(newPort);
  },

  getPorts: function() {
    return ports;
  },
  
  getConfEn: function() {
    return conf_enabled;
  },
  setConfEn: function(Status) {
    conf_enabled = Status;
  },

  reset: function(){
      
      // we close all connections
      return Promise.map(ports, function(port){
          return closeConnection(port);
      })
      .then(function(){

          // then we reset ports variable
          ports = [];
      })
  }
};

function closeConnection(port){
  return new Promise(function(resolve, reject){
      port.close(function(){
          resolve();
      });
  });  
}