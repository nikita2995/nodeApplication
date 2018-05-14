/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

// NPM Modules
const _                     = require('lodash'),
// Internal Modules
      config                = require('../config'),
      Service               = require('../libs/service'),
      mongoDB               = config.dbConnection,
      Logger                = config.logger;

module.exports =  {
  
  register : (req, res, next) => {

    let email             = _.get(req, ['body', 'email'], ''),
        password          = _.get(req, ['body', 'password'], '');

    mongoDB.getDB().collection('temporary_user').findOne({email: email})
    .then( result => {
      if(result) {

      }
    })
    // mongoDB.getDB().collection('temporary_user').insertOne({ email: email, password: password })
    // .then( (result) => {

    // })
    // .catch;

    return next();

  },

  /**
   * `request` is used to log/print API request details.
   * Only details are logged and no additional operation should be performed.
  */
  request : (req, res, next) => {

    // Extracting info from request
    let url                 = _.get(req, ['url'], ''),
        method              = _.get(req, ['method'], '').toUpperCase(),
        body                = _.get(req, ['body'], {}),
        query               = _.get(req, ['query'], {});

    Logger.info(method + ': ' + url);
    Logger.info('Params: ' + JSON.stringify((method === "POST" || method === "PUT") ? body : query));

    return next();

  },

  /**
   * `response` is used to log/print API response and sent to client.
  */
  response : (req, res, next) => {

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
    finalResponse = Service.encrypt(JSON.stringify(finalResponse));

    return res.status(200).send(finalResponse);
    
  },

};