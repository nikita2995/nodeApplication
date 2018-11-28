/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

// NPM Modules
const Q                             = require('q'),
      REQUEST                       = require('request'),
      _                             = require('lodash'),
// Internal Modules
      config                        = require('../config'),
      color                         = config.color,
      LOG                           = config.LOG;

module.exports = {

  makeRequest: reqOps => {

    let deferred = Q.defer();

    // LOG.file.info("Making request with: ".info, JSON.stringify(reqOps).info);

    // Making API call with request options provided.
    REQUEST(reqOps, (err, response, body) => {

      let statusCode = _.get(response, 'statusCode', 509);

      // If error occured, `error` is set.
      if (err || !response) {

        let errRes = {
          status: false,
          message: err || "Unknown error",
          statusCode: statusCode
        };

        deferred.reject(errRes);
        return ;
      }

      // Parsing json response
      try {
        if ((typeof body).toLowerCase() === 'string') {
          body = JSON.parse(body);
        }
      }
      catch (e) {

        // If response is not json or unable to parse, `error` is set.
        let errParse = {
          status: false,
          message: "Unable to parse response, error: " + e,
          statusCode: statusCode
        };
        
        deferred.reject(errParse);
        return ;

      }

      // If response is success, `status` is set `true`.
      let success = {
        status: true,
        result: body,
        statusCode: statusCode
      };
      
      // LOG.file.info("Response for request with: ".info, JSON.stringify(success).info);
      deferred.resolve(success);
      return ;

    });

    return deferred.promise;
  }
};
