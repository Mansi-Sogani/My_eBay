var expressWinston = require('express-winston');
var winston = require('winston');

var abc= expressWinston.logger({
  transports: [
    new winston.transports.File({
      json: true,
      filename: 'somelog.log',
      colorize: true
    })
  ],
});

exports.logger=exports;