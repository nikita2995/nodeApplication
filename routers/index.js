/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

const INFO              = require('./info');

module.exports = (app) => {

  app.post('/v1/app/login', INFO.info, (req, res) => {

    return res.send('Hello World');
    
  });

};