/**
 * @fileoverview Simple http server for server fake json requests, static file serving,and other
 * mockery.
 */
var PORT = 8090;
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/..'));

console.log('starting server at port', PORT);
app.listen(PORT);
