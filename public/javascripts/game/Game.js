$(document).ready(function () {
	'use strict';
	var Game = function () {
		var game = this;
		game.biome = new Biome();
		game.map = new Map();
	}
	//creation de personnage en fonction du type.
	Game.prototype.createPlayer = function (s) {
		var game = this;
		if (s === 'local') {
			var nom = prompt("Saisisez votre nom");
			if (nom != null) {
				var p = new Personnage(window.socketId, nom, 100, 'feu', 'player');
				core.socket.emit('registerPlayer', p);
				game.localPlayer = p;
				game.biome.personnages.push({
					id: window.socketId,
					player: p,
					type: 'player'
				});
			}
		}
	}

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
		module.exports = Game;
	else
		window.Game = Game;

	//sockets
	core.socket.on('connect', function () {
		window.socketId = this.socket.sessionid;
		console.log(window.socketId);
		window.game.createPlayer('local');

	});
	//evenement quand un nouveau joueur arrive
	core.socket.on('newPlayerJoin', function (player) {
		var exists = false;
		for (var i = 0, nb = window.game.biome.personnages.length; i < nb; i++) {
			if (window.game.biome.personnages[i]._socketId === player.id) {
				exists = true;
			}
		}
		if (!exists) {
			console.log('adding to biome');
			console.log(player);
			var p = player.player;
			var play = new Personnage(player.id, p._name, p._life, p._element, p._type);
			window.game.biome.personnages.push({
				id: player.id,
				player: play,
				type: 'player'
			});
		}
	})
	//quand un joueur se déconnecte
	core.socket.on('deletePlayer', function (player) {
		var exists = false;
		for (var i = 0, nb = window.game.biome.personnages.length; i < nb; i++) {
			if (window.game.biome.personnages[i]._socketId === player.id) {
				exists = i;
			}
		}
		if (exists) {
			console.log('deleting from biome');
			console.log(player);
			window.game.biome.personnages.splice(exists, 1);
			$('#' + player.id).remove();
			console.log(window.game.biome.personnages);
		}
	})
	//on met a jour la liste des joueur (visible a gauche)
	core.socket.on('updatePlayerList', function (players) {
		$('.playerlist').html('');
		players.forEach(function (player) {
			var p = player.player;
			$('.players .playerlist').append('<li id="' + p._socketId + '">' + p._name + '</li>');
		})
		/*TEST de draw quand un player arrive*/

		/*fin du test*/
	})
});
