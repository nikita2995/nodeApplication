/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

// NPM Modules
const mongoose             = require('mongoose');

let database;

module.exports = {

  connectToDatabase: async () => {

    try {

      database = await mongoose.connect('mongodb://nikita:root@ds014388.mlab.com:14388/flipkart');
      return null;
      
    } catch(error) {

      return error;

    }
  },
  
  getDB : () => {

    return database;

  }
    
};