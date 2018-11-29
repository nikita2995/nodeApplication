/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

// NPM Modules
const _                     = require('lodash'),
      fs                    = require('fs'),
      jwt                   = require('jsonwebtoken'),
      steem                 = require('steem'),
// Internal Modules
      certificate           = fs.readFileSync( __dirname + '/../libs/certificate', 'utf8'),
      config                = require('../config'),
      REQUEST               = require('../libs/request'),
      Schema                = require('../utils/schema'),
      Service               = require('../libs/service'),
      Logger                = config.logger,
      mongoDB               = config.dbConnection,
      TemporaryUser         = Schema.temporary_user,
      User                  = Schema.user;

module.exports =  {

  accountDetails: (req, res, next) => {

    try {

      let name             = _.get(req, ['query', 'name'], '');
  
      let names = [];

      names.push(name);

      steem.api.setOptions({
        url: "htpts://peer.dev.nuvocash.net",
        address_prefix: "NVO",
        chain_id: "8f208acdb28adcbe816f754f3c9f9e40096cc12b072f2a038eb9d1331a24e7c6"
      });

      steem.api.getAccounts(names, function(err, result) {
        console.log(err, result);
      });
  
    } catch(error) {
  
      console.log(error);
      return next();

    }

  },
  
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
  register : async (req, res, next) => {

    try {

      let email             = _.get(req, ['body', 'email'], ''),
          password          = _.get(req, ['body', 'password'], ''),
          verificationCode  = Math.random().toString(36).substring(4);

      let result = await TemporaryUser.findOne({email: email});

      if(!result) {

        let 
          data = {
            subject : 'Registered Successfully!',
            verificationCode : verificationCode,
            email : email
          };
          
        await Service.sendMail(email, 'REGISTER', data);

        let tempUser = new TemporaryUser({
          email: email, 
          password: password, 
          verificationCode: verificationCode 
        });

        let saveResult = await tempUser.save();

        _.set(req, ['body', 'register'], true);
        return next();
          
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

    } catch( error ) {

      let registerError = {
        status:                   true,
        error:                    "Unable to register user",
        statusCode:               502
      };

      // Set `error` in request for `next` function to check.
      _.set(req, ['error'], registerError);
      return next();

    }

  },

  /**
   * `register` is used by user to register into app.
   * User is checked, if(!User) Mail is sent, User is added.
  */
 sample : async (req, res, next) => {

  try {

    let name             = _.get(req, ['body', 'name'], ''),
        password         = _.get(req, ['body', 'password'], '');

    steem.api.setOptions({
      url: "htpts://peer.dev.nuvocash.net",
      address_prefix: "NVO",
      chain_id: "8f208acdb28adcbe816f754f3c9f9e40096cc12b072f2a038eb9d1331a24e7c6"
    });

    var signup = steem.auth.generateKeys(name, password, ["owner", "active", "posting", "memo"]);

    console.log(signup);

    signup['username'] = name;
    signup['signator'] = 'stellar';

    let jwtSigned   = jwt.sign(signup, certificate, {algorithm: 'RS256'});

    let reqOps={
      url:    "https://api.dev.nuvocash.net/accounts/enroll",
      method: "POST",
      json: {
        jwt:                      jwtSigned
      }
    };

    console.log(reqOps);
    REQUEST.makeRequest(reqOps)
    .then( (result) => {
      console.log("Result", result);
      return next();
    }).catch(error => {
      console.log("Error", error);
      return next();
    })

  } catch(error) {

    console.log(error);
    return next();
  }

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

  verifyEmail : async (req, res, next) => {

    try {

      let query             = _.get(req, ['query'], {}),
          email             = _.get(query, ['email'], ''),
          verificationCode  = _.get(query, ['verificationCode'], '');

      let condition = {
        email: email,
        verificationCode: verificationCode
      };

      let result = await TemporaryUser.findOne(condition);

      if(result) {

        let user = new User({
          email: email,
          password: Service.encrypt(result.password)
        });
        
        let saveResult = await user.save();

        await TemporaryUser.remove(condition);
        let html = '<h1>Email Verified</h1><p>Redirecting to login page</p><script>(function(){setTimeout(function(){window.location.href="http://localhost:3001";},1000);})();</script>';
        return res.send(html).end();

      } else {
        
        let errorHTML = '<h1>Invalid Request</h1>';
        return res.send(errorHTML).end();
        
      }

    } catch( error ) {

      let errorHTML = '<h1>Invalid Request</h1>';
      return res.send(errorHTML).end();

    }

  }

};