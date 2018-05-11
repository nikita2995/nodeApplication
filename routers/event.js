/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

const _                     = require('lodash'),
      config                = require('../config'),
      Logger                = config.logger;

module.exports =  {
  
  info : (req, res, next) => {

    let url                 = _.get(req, ['url'], ''),
        method              = _.get(req, ['method'], '').toUpperCase(),
        body                = _.get(req, ['body'], {}),
        query               = _.get(req, ['query'], {});

    Logger.info(method + ': ' + url);
    Logger.info('Params: ' + JSON.stringify((method === "POST" || method === "PUT") ? body : query));
    return next();

  },

  response : (req, res, next) => {

    // Check for `error` in request
    if( _.get(req, ['error', 'status'], false) ) {

      return next();

    }

    let finalResponse = {
      status : true,
      message : _.get(req, ['body'], {}),
      statusCode : 200
    };
    
    Logger.info('Response: ' + JSON.stringify(finalResponse));

    return res.status(200).send(finalResponse);
    
  }
};