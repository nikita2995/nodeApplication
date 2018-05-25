/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

// NPM Modules
const crypto                = require('crypto'),
      fs                    = require('fs'),
      Mustache              = require('mustache'),
      nodemailer            = require('nodemailer'),
      Q                     = require('q'),
//Internal NPM
      config                = require('../config'),
      utils                 = require('../utils'),
      APPCONST              = utils.appConst,
      Logger                = config.logger;

let registerTemplate;

// To send Success Mail for registration
fs.readFile(__dirname + '/../utils/mailFormat/register.html', 'utf8', (err, data) => {
  if (err) registerTemplate          = '';
  else registerTemplate              = data;
  Mustache.parse(registerTemplate);   // optional, speeds up future uses
});

module.exports = {

  encrypt : (text) => {

    var cipher	= crypto.createCipher('aes-256-cbc', '123456'),
      crypted	= cipher.update(text, 'utf8', 'hex');

    crypted += cipher.final('hex');

    return crypted;

  },

  decrypt : (text) => {

    var decipher  = crypto.createDecipher('aes-256-cbc', '123456'),
	    decrypted = decipher.update(text, 'hex', 'utf8');

    decrypted += decipher.final('utf8');

    return decrypted;
  
  },

  sendMail : (email, event, data) => {

    let deferred          = Q.defer(),
    html = '';

    if( event === 'REGISTER' ) {
      html = Mustache.render(registerTemplate, data);
    }

    let transporter = nodemailer.createTransport({
      service:'Gmail',
      port: 587,
      tls:true,
      secure: false,
      host: 'smtp.gmail.com',
      auth: {
        user: APPCONST.mailConfig.userName,
        pass: APPCONST.mailConfig.password
      }
    });
  
    let mailOptions = {
      from: APPCONST.mailConfig.userName,
      to: email,
      subject: data.subject,
      html: html
    };
  
    transporter.sendMail(mailOptions, (error, info) => {

      if (error) {
          Logger.info(error);
          return deferred.reject(error);
      }
      Logger.info('Message sent: %s', info.messageId);
      Logger.info('Preview mail: %s', JSON.stringify(mailOptions));
      return deferred.resolve(true);

    });

    return deferred.promise;
  },

};