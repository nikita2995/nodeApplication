/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

const mongoose                      = require('mongoose'),
      Schema                        = mongoose.Schema;

const temporary_user = new Schema({
  email: {type: String, unique: true},
  password: String,
  verificationCode: String
});

const user = new Schema({
  email: {type: String, unique: true},
  password: String,
  firstName: String,
  lastName: String,
  dOB: Date
});

module.exports = {
  temporary_user : mongoose.model('temporary_users', temporary_user),
  user: mongoose.model('users', user),
};