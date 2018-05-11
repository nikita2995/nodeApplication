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
      APPCONST                = util.appConst;

const app                     = express();

//Parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//Parsing application/json
app.use(bodyParser.json());

routers(app);

app.post('/sampleGet', (req, res) => {

  console.log('Req Body',req.body);
  console.log('Req Query',req.query);

});
// Connect to the db
// MongoClient.connect("mongodb://nikita:root@ds014388.mlab.com:14388/flipkart", function (err, db) {
   
// console.log(db);
//   db.collection('temporary_user', function (err, collection) {
        
//     // collection.insert({ id: 1, firstName: 'Steve', lastName: 'Jobs' });
//     // collection.insert({ id: 2, firstName: 'Bill', lastName: 'Gates' });
//     // collection.insert({ id: 3, firstName: 'James', lastName: 'Bond' });
    
    

//     // db.collection('Persons').count(function (err, count) {
//     //     if (err) throw err;
        
//     //     console.log('Total Rows: ' + count);
//     // });
// });
                
// });


app.get('/sendMail', (req, res) => {

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
});

app.listen(3000, () => {
  console.log("Listening at port:", _.get(APPCONST, ['port'], 0));
});