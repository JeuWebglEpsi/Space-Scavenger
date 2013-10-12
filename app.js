/**
 * Main application
 */

var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path');

var app = express();

app.configure(function () {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.compress());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
	app.use(express.errorHandler());
});

var options = {};

routes(app, options);

var server = http.createServer(app).listen(app.get('port'), function () {
	console.log("JeuWebGlProjet listening on port " + app.get('port'));
});

var Players = [];


//socket
var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
	socket.on('registerPlayer', function (player) {
		if (Players.indexOf(player.id) === -1) {
			Players.push(player);
			socket.emit('newPlayerJoin', player);
		}
	})
	socket.on('moveX', function (x) {
		console.log(socket.id + ' moving ' + x);
		socket.broadcast.emit('moveX', socket.id, x);
	})
	socket.on('moveY', function (y) {
		console.log(socket.id + ' moving ' + y);
		socket.broadcast.emit('moveY', socket.id, y);
	})
})
