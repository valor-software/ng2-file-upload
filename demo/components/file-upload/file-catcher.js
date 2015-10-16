var express = require('express');
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');

var app = express();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '!put your host here!');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.post('/api', function (req, res) {
  var fstream;
  var files = [];
  var busboy = new Busboy({headers: req.headers});
  busboy.on('file', function (fieldname, file, filename) {
    fstream = fs.createWriteStream(__dirname + '/uploads/' + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
      files.push(filename);
      file.resume();
    });
  });

  busboy.on('finish', function () {
    res.end('ok');
  });
  req.pipe(busboy);
});

app.listen(process.env.PORT || 3000);
