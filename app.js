var express = require('express'),
  morgan = require('morgan'),
  _ = require('lodash'),
  pkg = require('./package.json')
  ;

var app = express();

app.use(morgan('dev'));

var options = {};

app.use('/', require('./routes/resources')(express));

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log(pkg.name + ' started on port '+port)
});