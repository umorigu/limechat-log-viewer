var express = require('express');
var app = express();
var fs = require('fs');

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  var dataDir = process.env.HOME + '/Documents/LimeChatLog';
  fs.readdir(dataDir, function(err, files) {
    if (err) throw err;
    var fileList = [];
    files.filter(function(file) {
      var fullFilename = dataDir + '/' + file;
      var stat = fs.statSync(fullFilename);
      return stat.isDirectory() && /^\#[\w\-_\.]+$/.test(file);
    }).forEach(function(file) {
      fileList.push({name: file, key: file.substr(1)});
    });
    res.render('index', { title: 'LimeChat Log Viewer', channels: fileList });
  });
});

app.listen(13000);
