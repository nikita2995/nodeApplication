/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

// NPM Modules
const _                     = require('lodash'),
// Internal Modules
      config                = require('../config'),
      Service               = require('../libs/service'),
      Logger                = config.logger;

module.exports = (req, res, next) => {

  // Check for `error` in request
  if( _.get(req, ['error', 'status'], false) ) {

    return next();

  }

  // Set `response` from req.body
  let finalResponse = {
    status : true,
    message : _.get(req, ['body'], {}),
    statusCode : 200
  };
  
  Logger.info('Response: ' + JSON.stringify(finalResponse));

  // For encrypting the data from server sent as response
  //finalResponse = Service.encrypt(JSON.stringify(finalResponse));

  return res.status(200).send(finalResponse);
    
}