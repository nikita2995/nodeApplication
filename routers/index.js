/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

const event              = require('./event');

module.exports = (app) => {

  app.post('/v1/app/login', event.info, event.response);

};