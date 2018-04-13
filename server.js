//"use strict"

const _                       = require('lodash'),
      express                 = require('express'),
      nodeMailer              = require('nodeMailer'),
      util                    = require('./utils'),
      APPCONST                = util.appConst;

const app                     = express();

app.get('/', (req, res) => {
  res.send('Hello World');
  console.log('App call');
})

app.get('/sendMail', (req, res) => {

  let transporter = nodeMailer.createTransport({
    service:'Gmail',
    auth: {
      user: 'khandelwalnikita02@gmail.com',
      pass: 'nikita@gmail'
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
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
});

app.listen(3000, () => {
  console.log("Listening at port:", _.get(APPCONST, ['port'], 0));
});