/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

// NPM Modules
const _                       = require('lodash'),
      bodyParser              = require('body-parser'),
      child_process           = require('child_process'),
      express                 = require('express'),
      nodemailer              = require('nodemailer'),
// Internal Modules
      config                  = require('./config'),
      routers                 = require('./routers'),
      util                    = require('./utils'),
      APPCONST                = util.appConst,
      mongodb                 = config.dbConnection;

const app                     = express();

//Parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//Parsing application/json
app.use(bodyParser.json());

mongodb.connectToDatabase()
.then( (err) => {

  if(err)
    console.log('Database connection failed');
  else
    console.log('Database connected');

})

routers(app);

app.post('/sampleGet', (req, res) => {

  console.log('Req Body',req.body);
  console.log('Req Query',req.query);

});

app.listen(_.get(APPCONST, ['port'], 0), () => {
  console.log("Listening at port:", _.get(APPCONST, ['port'], 0));
});