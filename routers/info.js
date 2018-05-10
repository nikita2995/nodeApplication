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

  }
};