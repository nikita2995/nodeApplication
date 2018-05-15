/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

// NPM Modules
const crypto                = require('crypto');

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

  sendMail : () => {

    let transporter = nodemailer.createTransport({
      service:'Gmail',
      port: 587,
      tls:true,
      secure: false,
      host: 'smtp.gmail.com',
      auth: {
        user: 'nikitakhandelwal2995@gmail.com',
        pass: 'N!k!ta@2995'
      }
    });
  
    let mailOptions = {
      from: 'khandelwalnikita02@gmail.com',
      to: 'khandelwalnikita02@gmail.com',
      subject: 'Sample',
      text: 'Sample text',
      html: '<b> Sample Text </b>'
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info));
  
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });

  },

};