/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

// NPM Modules
const mongoose             = require('mongoose'),
      Q                    = require('q');

let database;

module.exports = {

  connectToDatabase : () => {

    let deferred = Q.defer();

    mongoose.connect('mongodb://nikita:root@ds014388.mlab.com:14388/flipkart', function (err, db) {
   
      database = db;
      deferred.resolve(err);

    });

    return deferred.promise;

  },
  
  getDB : () => {

    return database;

  }
    
};