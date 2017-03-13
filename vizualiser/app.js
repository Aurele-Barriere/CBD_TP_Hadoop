var express = require('express');
var format = require('util').format;
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var uploadPath="upload";
var fs = require('fs');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('env', 'development');

app.use(express.favicon());
app.use(express.compress());
app.use(express.bodyParser({
  keepExtensions: true,
  uploadDir: __dirname +'/tmp' }));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/users', user.list);

app.post("/upload", function (req, res) {
  console.log(req)
  var filename=req.files.file.name;
  var extensionAllowed=[];
  var maxSizeOfFile=1000000;
  var msg="";
  var i = filename.lastIndexOf('.');
  var tmp_path = req.files.file.path;
  var target_path = __dirname +'/upload/' + req.files.file.name;
  var file_extension= (i < 0) ? '' : filename.substr(i);
  if(((req.files.file.size /1024 )< maxSizeOfFile)){
    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
      fs.unlink(tmp_path, function() {
        if (err) throw err;
      });
    });

    setTimeout(parse, 0, target_path, filename)
    var path = filename;
    res.render('postUpload', { title : "upload", parsed: filename});

    }else{
      fs.unlink(tmp_path, function(err) {
        if (err) throw err;
      });
    msg="File upload failed.File extension not allowed and size must be less than "+maxSizeOfFile;
  }
  res.end(msg);
});

// get single logs json format
app.get('/json/jobs/:id', function(req, res){
  var file = req.params.id
  fs.readFile(__dirname +'/parsed/' + file, 'utf-8', function (err, data) {
    if (err) {
      res.json("Unable to load the file : " + file)
      return
    }
    res.json(JSON.parse(data));
  });
});

//Attempts views
app.get('/jobs/:id/attempts', function(req, res){
  res.render('attempts', { title : "Log", parsed: req.params.id });
});

// Tasks view
app.get('/jobs/:id/tasks', function(req, res){
  res.render('tasks', { title : "Tasks", parsed: req.params.id });
});

// multiple jobs view
app.get('/jobs', function(req, res) {
  var rjobs = req.query.job;
  if (typeof(rjobs) === "undefined" || rjobs.length == 0)
  {
    msg="Select at least one job";
    res.end(msg);
  }

  console.log(rjobs);
  res.render('jobs', { title : "Jobs", jobs: rjobs});
})

// list logs
app.get('/logs', function(req, res){
  console.log("Getting all the files");
  files = fs.readdirSync(__dirname + '/parsed')
  console.log(files);
  res.render('logs', { title : "Logs", files: files });
});

// parse
function parse(filepath, name) {
  console.log("parsing file");
  fs.readFile(filepath, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    _parse(data.split('\n'), name);
  });

  console.log("parsing done");
}

function _parse(filearray, name) {
  var line = "";
  var line_array = [];
  var type = "";
  var matched_type = "";
  var result = {}
  var current = {};
  var fieldsId = "";
  var id = "";
  var current_type = {};
  //stores job, task, or attempt
  var current_event = {};

  for (var i in filearray) {
    line = filearray[i];
    //extract the type (Job, MapAttempt, ReduceAttempt)
    matched_type = line.match(/^(Job|ReduceAttempt|MapAttempt|Task)/g);
    if (matched_type == null) {
      console.log("skipped line : " + line);
      continue;
    }
    type = matched_type[0].trim();
    if (typeof result[type] === "undefined") {
      result[type] = {};
    }
    current_type = result[type];
    //remove the head
    //line = line.replace(type + " ", "");

    //get the id given the type
    switch(type) {
      case "Job":
        fieldsId = line.match(/JOBID="\w+"/)
        break;
      case "ReduceAttempt":
        fieldsId = line.match(/TASK_ATTEMPT_ID="\w+"/)
        break;
      case "MapAttempt":
        fieldsId = line.match(/TASK_ATTEMPT_ID="\w+"/)
        break;
      case "Task":
        fieldsId = line.match(/TASKID="\w+"/)
        break;
      default:
       console.log("Type not handled by the parser : " + type);
        break;
    }
    if (fieldsId == null) {
      continue
    }
    id = fieldsId[0].split("=")[1].replace(/"/g, "");
    if (typeof current_type[id] === "undefined") {
      current_type[id] = {}
    }
    current_event = current_type[id];
    //handle counters fields (contains spaces)
    line_array = line.split("=");
    //["xax key1"]["value1 key2"]...
    var j = 0;
    while (j < line_array.length - 1) {
      var key = line_array[j].match(/\w+$/);
      if (key == null) {console.log("Parser can't handle " + line_array[j]);j++; continue;}
      key = key[0];
      var value = line_array[j+1].match(/^".*" /);
      if (value == null) {console.log("Parser can't handle " + line_array[j+1]);j++; continue;}
      value = value[0].replace(/"/g, "").trim();
      current_event[key] = value;
      j++
    }
  }

  var outputFilename =  __dirname +'/parsed/' + name ;
  //write result back to file
  fs.writeFile(outputFilename, JSON.stringify(result, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + outputFilename);
    }
  });
}


function oc(a){
  var o = {};
  for(var i=0;i<a.length;i++) {
    o[a[i]]='';
  }
  return o;
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
