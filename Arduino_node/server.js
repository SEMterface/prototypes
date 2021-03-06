// Generated by CoffeeScript 1.6.3
(function() {
  var SerialPort, app, express, fs, interval, lightOn, port, sendA, sendD, sendS, sendW, serial, toggle, turnOff, turnOn,
    _this = this;

  SerialPort = require('serialport').SerialPort;

  fs = require('fs');

  port = '/dev/tty.usbmodem1d11';

  express = require('express');

  serial = null;

  interval = null;

  lightOn = false;

  turnOn = function() {
    lightOn = true;
    return serial.write(new Buffer([49]));
  };

  turnOff = function() {
    lightOn = false;
    return serial.write(new Buffer([48]));
  };

  sendA = function() {
    return serial.write(new Buffer([97]));
  };

  sendS = function() {
    return serial.write(new Buffer([115]));
  };

  sendD = function() {
    return serial.write(new Buffer([100]));
  };

  sendW = function() {
    return serial.write(new Buffer([119]));
  };

  toggle = function() {
    if (lightOn) {
      return turnOff();
    } else {
      return turnOn();
    }
  };

  app = express.createServer();

  app.get('/', function(req, res) {
    return res.sendfile('index.htm');
  });

  app.get('/on', function(req, res) {
    clearInterval(interval);
    turnOn();
    return res.end();
  });

  app.get('/off', function(req, res) {
    clearInterval(interval);
    turnOff();
    return res.end();
  });

  app.get('/blink', function(req, res) {
    clearInterval(interval);
    interval = setInterval(toggle, 500);
    return res.end();
  });

  app.get('/a', function(req, res) {
    clearInterval(interval);
    sendA();
    return res.end();
  });

  app.get('/s', function(req, res) {
    clearInterval(interval);
    sendS();
    return res.end();
  });

  app.get('/d', function(req, res) {
    clearInterval(interval);
    sendD();
    return res.end();
  });

  app.get('/w', function(req, res) {
    clearInterval(interval);
    sendW();
    return res.end();
  });

  console.log("Starting...");

  fs.stat(port, function(err, stats) {
    if (err != null) {
      console.log("Couldn't stat " + port);
      process.exit();
    }
    console.log("Started.");
    serial = new SerialPort(port, {
      baudrate: 9600
    });
    return app.listen(8080);
  });

}).call(this);
