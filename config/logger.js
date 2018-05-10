/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

const winston               = require('winston'),
      fs                    = require('fs'),
      moment                = require('moment');

const logger                = __dirname + '/../logger';

if(!fs.existsSync(logger)) {
  fs.mkdirSync(logger);
}

winston.setLevels(winston.config.npm.levels);
winston.addColors(winston.config.npm.colors);

module.exports = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
      timestamp() {return moment().format('DD-MM-YYYY HH:mm:ss:SSS');},
    }),
    new winston.transports.File({
      level: 'info',
      timestamp() {return moment().format('DD-MM-YYYY HH:mm:ss:SSS');},
      filename: `${logger}/server.log`,
      handleExceptions: true,
      json: false,
    })
  ]
});