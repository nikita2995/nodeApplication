const INFO              = require('./info');

module.exports = (app) => {

  app.post('/v1/app/login', INFO, (req, res) => {

    return res.send('Hello World');
    
  });

}