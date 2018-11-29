/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

// Internal Modules
const event              = require('./event');

module.exports = (app) => {

  app.post('/v1/app/login', event.request, event.response);

  app.post('/v1/app/register', event.request, event.register, event.response, event.error);

  app.get('/verifyEmail', event.request, event.verifyEmail, event.response, event.error);

  app.post('/v1/app/sample', event.request, event.sample, event.response, event.error);

  app.get('/v1/app/accountDetails', event.request, event.accountDetails, event.response, event.error);

};