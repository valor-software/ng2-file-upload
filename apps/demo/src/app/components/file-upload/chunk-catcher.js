/*eslint-disable*/
// Reassembles files sent by ChunkedFileUploader (multipart mode).
// The first chunk creates an upload and returns its id; the app sends the rest to /api/chunks/:id.
var express = require('express');
var multer = require('multer');
var crypto = require('crypto');
var fs = require('fs');
var app = express();

var DIR = './uploads/';
var upload = multer({ storage: multer.memoryStorage() });
var nextChunk = {}; // upload id -> index of the next expected chunk

fs.mkdirSync(DIR, { recursive: true });

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    return res.end();
  }
  next();
});

// first chunk: start a new upload
app.post('/api/chunks', upload.single('file'), function (req, res) {
  var id = crypto.randomUUID();
  fs.writeFileSync(DIR + id, req.file.buffer);
  if (Number(req.body.totalChunks) > 1) {
    nextChunk[id] = 1;
  } else {
    console.log('Upload ' + id + ' complete: ' + req.file.originalname);
  }
  res.json({ id: id });
});

// following chunks: append them in order
app.post('/api/chunks/:id', upload.single('file'), function (req, res) {
  var id = req.params.id;
  var index = Number(req.body.chunkIndex);
  if (!(id in nextChunk)) {
    return res.status(404).json({ error: 'unknown upload' });
  }
  if (index > nextChunk[id]) {
    return res.status(409).json({ error: 'chunk ' + nextChunk[id] + ' expected' });
  }
  // a resumed upload can send a chunk that was already stored; skip it
  if (index === nextChunk[id]) {
    fs.appendFileSync(DIR + id, req.file.buffer);
    nextChunk[id]++;
  }
  if (nextChunk[id] === Number(req.body.totalChunks)) {
    delete nextChunk[id];
    console.log('Upload ' + id + ' complete: ' + req.file.originalname);
  }
  res.json({ id: id });
});

// cancelled chunks arrive as aborted requests
app.use(function (err, req, res, next) {
  console.log(err.message);
  res.status(500).end();
});

var PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('Working on port ' + PORT);
});
