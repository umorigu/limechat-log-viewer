var express = require('express');
var app = express();
var fs = require('fs');

var dataDir = process.env.HOME + '/Documents/LimeChatLog';

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
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

app.get('/channel/:channel', function (req, res) {
  var chname = '#' + req.params.channel;
  var title = chname + ' - LimeChat Log Viewer';
  var channelDir = dataDir + '/' + chname;
  fs.readdir(channelDir, function(err, files) {
    console.log('readdir end!!!');
    if (err) {
      console.log(err);
      return;
      //throw err;
    }
    var logList = [];
    var logs = files.filter(function(file) {
      var fullFilename = channelDir + '/' + file;
      var stat = fs.statSync(fullFilename);
      return stat.isFile() && /\.txt$/.test(file);
    });
    var count = logs.length;
    logs.forEach(function(file) {
      var fullFilename = channelDir + '/' + file;
      (function(){
        var f = file;
        fs.readFile(fullFilename, 'utf-8', function(err, text) {
          //console.log('read: ' + fullFilename);
          logList.push({ name: f, body: text });
          if (--count == 0) {
            console.log('end! - ' + chname);
            logList.sort(function(a, b) {
              if (a.name < b.name) return -1;
              if (a.name > b.name) return 1;
              return 0;
            });
            console.log('sorted!');
            res.render('channel', { title: title, logList: logList });
          }
        });
      })();
    });
  }); 
});

app.listen(13000);
