var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
//Mongo stuff
//var mongo = require('mongodb');
//var monk = require('monk');
//var db = monk('localhost:27017/bughousechess');
//var shoutDB = db.get('shout');


//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

//server.listen(3000);
app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//serve static page
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/public/rec.html');
});

var guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return s4();
};


io.sockets.on('connection', function (socket) {
	var userID;
    var roomName;
    socket.on('setUserID', function(user) {
        userID = user;
    });
    
	socket.on('joinRoom', function(room) {
        roomName = room;
		if(1){
			socket.join(room);
			console.log("Player: " + userID + " joined Room: " + room);
		}
    });
    socket.on('getChat', function (message) {
        io.to(roomName).emit('getChat', userID, message);
        console.log(userID+ ": " + message);
    });
    
    socket.on('newRoom', function () {
        roomName = guid();
		if(1){
			socket.join(roomName);
			console.log("Player: " + userID + " joined Room: " + roomName);
            socket.emit('updateGameID', roomName);
        }
    });    
    socket.on('getMusic', function(mp3) {
        console.log("getMusic");
        console.log(mp3);
        socket.broadcast.to(roomName).emit('getMusic',mp3);
        console.log("sendMusic");
        //console.log(mp3);
    });
});

server.listen(app.get('port'), function() {
    console.log("Server listening on port " + app.get('port'));
});

