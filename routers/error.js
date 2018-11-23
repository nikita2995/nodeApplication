/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

// NPM Modules
const _                     = require('lodash'),
// Internal Modules
      config                = require('../config'),
      Service               = require('../libs/service'),
      Logger                = config.logger;

module.exports = (req, res) => {

  let resError = {
    status:               false,
    error:                _.get(req, ['error'], {}),
    statusCode:           _.get(req, ['error', 'statusCode'], 509)
  };

  Logger.error("Response: ", JSON.stringify(resError));

  return res.status(_.get(resError, ['statusCode'], 509)).send(resError);

}