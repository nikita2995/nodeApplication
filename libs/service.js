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
  
  }

};