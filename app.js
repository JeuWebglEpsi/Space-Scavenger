/**
 * Main application
 */
//express est le serveur web
//route gere les requettes
var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path');

var app = express();

//configurations
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


//tableau des joueurs connéctés
//contien des objets {idDeSocket, player}
var Players = [];


//socket
var io = require('socket.io').listen(server);

io.on('connection', function (socket) {

    //a la connection on enregistre la socket
    if (Players.indexOf(socket.id) === -1) {
        console.log('register socket ' + socket.id);
        Players.push({
            id: socket.id,
            type: 'player'
        });
        console.log(Players);
    }
    //on associe un player a une socket une fois qu'il est créé
    socket.on('registerPlayer', function (player) {
        for (var i = 0, nb = Players.length; i < nb; i++) {
            if (Players[i].id === socket.id) {
                Players[i].player = player
                socket.broadcast.emit('newPlayerJoin', Players[i]);
                io.sockets.emit('updatePlayerList', Players);
                socket.emit('updateIdPlayer', socket.id);
            }
        }
    })

    //on déplace le joueur du socket en cour
    socket.on('moveX', function (x) {
        console.log(socket.id + ' moving ' + x);
        socket.emit('moveX', socket.id, x);
        socket.broadcast.emit('moveX', socket.id, x);
    })
    socket.on('moveY', function (y) {
        console.log(socket.id + ' moving ' + y);
        socket.emit('moveY', socket.id, y);
        socket.broadcast.emit('moveY', socket.id, y);
    })

    //deconnecton du socket
    socket.on('disconnect', function () {
        for (var i = 0, nb = Players.length; i < nb; i++) {
            if (Players[i])
                if (socket.id === Players[i].id) {
                    Players.splice(i, 1);
                }
        }
        //on broadcast la déconnection
        socket.broadcast.emit('deletePlayer', socket.id);
        io.sockets.emit('updatePlayerList', Players);
    })
})
