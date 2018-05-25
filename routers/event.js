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
  
  error : (req, res) => {

    let resError = {
      status:               false,
      error:                _.get(req, ['error'], {}),
      statusCode:           _.get(req, ['error', 'statusCode'], 509)
    };
  
    Logger.error("Response: ", JSON.stringify(resError));
  
    return res.status(_.get(resError, ['statusCode'], 509)).send(resError);

  },

  /**
   * `register` is used by user to register into app.
   * User is checked, if(!User) Mail is sent, User is added.
  */
  register : (req, res, next) => {

    let email             = _.get(req, ['body', 'email'], ''),
        password          = _.get(req, ['body', 'password'], ''),
        verificationCode  = Math.random().toString(36).substring(4);

    mongoDB.getDB().collection('temporary_user').findOne({email: email})
    .then( result => {

      if(!result) {

        let 
          data = {
            subject : 'Registered Successfully!',
            verificationCode : verificationCode,
            email : email
          };
        
        Service.sendMail(email, 'REGISTER', data)
        .then( () => {

          return mongoDB.getDB().collection('temporary_user')
          .insertOne({ 
            email: email, 
            password: password, 
            verificationCode: verificationCode 
          });

        })
        .then( (result) => {

          _.set(req, ['body', 'register'], true);
          return next();

        })
        .catch( err => {

          let registerError = {
            status:                   true,
            error:                    "Entered incorrect email",
            statusCode:               502
          };
  
          // Set `error` in request for `next` function to check.
          _.set(req, ['error'], registerError);
          return next();

        });
        

      } else {

        let registerError = {
          status:                   true,
          error:                    "User already exist",
          statusCode:               502
        };

        // Set `error` in request for `next` function to check.
        _.set(req, ['error'], registerError);
        return next();

      }

    })
    .catch( err => {

      let registerError = {
        status:                   true,
        error:                    "Unable to register user",
        statusCode:               502
      };

      // Set `error` in request for `next` function to check.
      _.set(req, ['error'], registerError);
      return next();

    });

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
    //finalResponse = Service.encrypt(JSON.stringify(finalResponse));

    return res.status(200).send(finalResponse);
    
  },

  verifyEmail : (req, res, next) => {

    let query             = _.get(req, ['query'], {}),
        email             = _.get(query, ['email'], ''),
        verificationCode  = _.get(query, ['verificationCode'], '');

    let condition = {
      email: email,
      verificationCode: verificationCode
    };

    mongoDB.getDB().collection('temporary_user').findOne(condition)
    .then( (result) => {

      if(!result) {

      } else {
        
      }

    })
    .catch( (error) => {

    });

  }

};