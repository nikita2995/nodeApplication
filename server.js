//"use strict"

const _                       = require('lodash'),
      express                 = require('express'),
      util                    = require('./utils'),
      APPCONST                = util.appConst;

const app                     = express();

app.get('/', (req, res) => {
  res.send('Hello World');
  console.log('App call');
})

app.listen(3000, () => {
  console.log("Listening at port:", _.get(APPCONST, ['port'], 0));
});