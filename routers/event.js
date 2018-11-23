/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

// NPM Modules
const _                     = require('lodash'),
      dsteem                = require('dsteem'),
// Internal Modules
      config                = require('../config'),
      Schema                = require('../utils/schema'),
      Service               = require('../libs/service'),
      Logger                = config.logger,
      mongoDB               = config.dbConnection,
      TemporaryUser         = Schema.temporary_user,
      User                  = Schema.user;

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

    let opts = {};
    //connect to production server
    opts.addressPrefix = 'TST';
    opts.chainId =
        '46d82ab7d8db682eb1959aed0ada039a6d49afa1602491f93dde9cac3e8e6c32';

    const client = new dsteem.Client('https://testnet.steemitdev.com', opts);

    let avail = 'Account is NOT available to register';

    if (name.length > 2) {
      let _account = await client.database.call('get_accounts', [
          [name],
      ]);

      console.log(`_account:`, _account, name.length);

      if (_account.length == 0) {
          avail = 'Account is available to register';
      }
      
      console.log(avail);
    }


    const ownerKey = dsteem.PrivateKey.fromLogin(name, password, 'owner');
    const activeKey = dsteem.PrivateKey.fromLogin(name, password, 'active');
    const postingKey = dsteem.PrivateKey.fromLogin(name, password, 'posting');
    const memoKey = dsteem.PrivateKey.fromLogin(
        name,
        password,
        'memo'
    ).createPublic(opts.addressPrefix);

    const ownerAuth = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[ownerKey.createPublic(opts.addressPrefix), 1]],
    };
    const activeAuth = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[activeKey.createPublic(opts.addressPrefix), 1]],
    };
    const postingAuth = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[postingKey.createPublic(opts.addressPrefix), 1]],
    };

    const privateKey = dsteem.PrivateKey.fromString(
        '5Jtbfge4Pk5RyhgzvmZhGE5GeorC1hbaHdwiM7pb5Z5CZz2YKUC'
    );

    const op = [
        'account_create',
        {
            fee: '3.000 STEEM',
            creator: 'demo',
            new_account_name: name,
            owner: ownerAuth,
            active: activeAuth,
            posting: postingAuth,
            memo_key: memoKey,
            json_metadata: '',
        },
    ];

    let result = await client.broadcast.sendOperations([op], privateKey);

    _.set(req, ['body'], {});
    _.set(req, ['body', 'blockNumber'], result.block_num);
    return next();

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