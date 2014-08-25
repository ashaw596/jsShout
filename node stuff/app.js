var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
//Mongo stuff
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/bughousechess');
var chatDB = db.get('chat');
var chessDB = db.get('chess');
/*
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bughousechess');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("connected!");
});
var gamesSchema = mongoose.Schema({
    gameID: String,
	p1ID: String,
	p2ID: String,
	p3ID: String,
	p4ID: String,
	p1LastMoveTime: Number,
	p2LastMoveTime: Number,
	p3LastMoveTime: Number,
	p4LastMoveTime: Number,
	p1TotalMoveTime: Number,
	p2TotalMoveTime: Number,
	p3TotalMoveTime: Number,
	p4TotalMoveTime: Number,
	board1Moves: String,
	board2Moves: String
},{ collection : 'games2' })

var game = mongoose.model('games2', gamesSchema);
*/
//var milliseconds = (new Date).getTime(); //epoch time

//var mongo = require('mongoskin');
//var db = mongo.db("mongodb://localhost:27017/nodetest2", {native_parser:true});
var players = 12;
var routes = require('./routes/index');
var users = require('./routes/users');

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
  res.sendfile(__dirname + '/public/test.html');
});

var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '' + s4() + '' + s4() + '' +
           s4() + '' + s4() + s4() + s4();
  };
})();

function generateAuth () {
    var id = players++;
    var code = guid();
    console.log("code:"+code);
    return [id, code];
}

io.sockets.on('connection', function (socket) {
	var playerID;
    var roomName;
    var numInRoom = []; //number of players that have joined a game, this needs to be global somehow
    function getNumInGame(ID){
		//result=collection.find( {gameID:ID} ).toArray();
		//console.log(result);
	}
    socket.on('authenticate', function(id, code) {
        //checkID(id,code)
        var newCode;
        if(id) {
            playerID = id;
            //check(auth codes)
            //
            newCode = code;
           
        } else {
            gen = generateAuth();
            playerID = gen[0];
            newCode = gen[1];
            console.log("New User Connected:" + playerID);
        }
        socket.emit('updateAuth', playerID, newCode);
    });
    
    function resetMoves () {
        chessDB.find({room:roomName}, ['playerID', 'x1', 'y1', 'x2', 'y2'], function (err, docs){
            socket.emit('resetMoves', docs);
        });
    }
    
	socket.on('joinRoom', function(room) {
        roomName = room;
		//if(numInRoom.room<4){
		numInGame=getNumInGame(room);
		if(1){
			socket.join(room);
            //add player ID to the DB
			/*collection.update(
			   { gameID: room }, //find by game ID
			   {
				  $set: { p2ID: playerID }
			   }
			);*/
            
            chatDB.find({room:room}, ['playerID', 'message'], function (err, docs){
                socket.emit('resetChat', docs);
                console.log(docs);
            });
            
            resetMoves();
            
			numInRoom.room+=1;
			console.log("Player: " + playerID + " joined Room: " + room);
		}
		else{
			console.log("game is full!");
			console.log(numInRoom.room);
			console.log(room);
		}
    });
    socket.on('getChat', function (message) {
        var username = playerID;
        chatDB.insert({ room: roomName, playerID: playerID, message: message}, 
            function (err, doc) {
                if (err) throw err;
            }
        );
        io.to(roomName).emit('getChat', username, message);
        console.log(username+ ": " + message);
    });
    socket.on('newRoom', function () {
        roomName = guid();
		if(1){
			socket.join(roomName);
			numInRoom.room+=1;
			console.log("Player: " + playerID + " joined Room: " + roomName);
            io.sockets.emit('updateGameID', roomName);
        }
		else{
			console.log("game is full!");
			console.log(numInRoom.room);
			console.log(roomName);
		}
    });
    
    socket.on('getMove', function(x1, y1, x2, y2) {
        chessDB.insert({room: roomName, playerID: playerID, x1: x1, y1:y1, x2:x2, y2:y2}, 
            function (err, doc) {
                if (err) throw err;
            }
        );
        socket.broadcast.to(roomName).emit('getMove', x1, y1, x2, y2);
    });
    
    socket.on('newGame', function () {
		//var gameID = guid();
		//var player1ID = guid();
        //io.sockets.emit('updateGameID', gameID);
		//io.sockets.emit('updatePlayerID', player1ID);
		//socket.join(gameID);
		numInRoom.gameID=1;
		//create game in db
        /*
		collection.insert({
			gameID: gameID,
			p1ID: player1ID,
			p2ID: "",
			p3ID: "",
			p4ID: "",
			p1LastMoveTime: 0,
			p2LastMoveTime: 0,
			p3LastMoveTime: 0,
			p4LastMoveTime: 0,
			p1TotalMoveTime: 0,
			p2TotalMoveTime: 0,
			p3TotalMoveTime: 0,
			p4TotalMoveTime: 0,
			board1Moves: "",
			board2Moves: ""
		});
        */
		//console.log(numInRoom.gameID);
		//console.log("New game: " + gameID);
    });
/*
    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function(username){
        // we store the username in the socket session for this client
        socket.username = username;
        // add the client's username to the global list
        usernames[username] = username;
        // echo to client they've connected
        socket.emit('updatechat', 'SERVER', 'you have connected');
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
        // update the list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function(){
        // remove the username from global usernames list
        delete usernames[socket.username];
        // update list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);
        // echo globally that this client has left
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    });
	*/
});
server.listen(app.get('port'), function() {
	console.log("Server listening on port " + app.get('port'));
});
