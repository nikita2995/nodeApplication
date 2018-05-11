/*jshint esversion: 6, multistr: true, node: true*/

"use strict";

// NPM Modules
const MongoClient             = require('mongodb').MongoClient;

let database = null;

MongoClient.connect("mongodb://nikita:root@ds014388.mlab.com:14388/flipkart", function (err, db) {
   
    database = db;
    console.log('Database Connected');

});

module.exports = {

    db :database
    
};