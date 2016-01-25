/* jshint node: true */
'use strict';

var express = require('express');
var path = require('path');
var app = express();

function getUserAgentHeaders (headers) {
  return headers;
}


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

app.get('/api', function (req, res) {
  res.json(getUserAgentHeaders(req.headers));
});

module.exports = app;
