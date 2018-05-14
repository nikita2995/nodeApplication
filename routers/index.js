/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

// Internal Modules
const event              = require('./event');

module.exports = (app) => {

  app.post('/v1/app/login', event.request, event.response);

  app.post('/v1/app/register', event.request, event.register, event.response);

};