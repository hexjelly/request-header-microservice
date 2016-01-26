/* jshint node: true */
'use strict';

var express = require('express');
var path = require('path');
var UAParser = require('ua-parser-js');
var app = express();

function getUserAgentHeaders (req) {
  var ip = req.ip;
  var parser = new UAParser();
  parser.setUA(req.headers['user-agent']);
  var lang = req.headers['accept-language'];
  lang = lang ? lang.split(',')[0] : '';
  var result = { 'ip': ip, 'os': parser.getOS(), 'lang': lang };
  return result;
}


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

app.get('/api', function (req, res) {
  res.json(getUserAgentHeaders(req));
});

module.exports = app;
