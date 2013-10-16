$(document).ready(function () {
	'use strict';
	var Game = function () {
		var game = this;
		game.biome = new Biome();
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

	//on met l'objet game dans la fenetre.
	window.game = new Game();


	//sockets
	core.socket.on('connect', function () {
		window.socketId = this.socket.sessionid;
		console.log(window.socketId);
		game.createPlayer('local');

	});
	//evenement quand un nouveau joueur arrive
	core.socket.on('newPlayerJoin', function (player) {
		var exists = false;
		for (var i = 0, nb = game.biome.personnages.length; i < nb; i++) {
			if (game.biome.personnages[i]._socketId === player.id) {
				exists = true;
			}
		}
		if (!exists) {
			console.log('adding to biome');
			console.log(player);
			var p = player.player;
			var play = new Personnage(player.id, p._name, p._life, p._element, p._type);
			game.biome.personnages.push({
				id: player.id,
				player: play,
				type: 'player'
			});
		}
	})
	//quand un joueur se déconnecte
	core.socket.on('deletePlayer', function (player) {
		var exists = false;
		for (var i = 0, nb = game.biome.personnages.length; i < nb; i++) {
			if (game.biome.personnages[i]._socketId === player.id) {
				exists = i;
			}
		}
		if (exists) {
			console.log('deleting from biome');
			console.log(player);
			game.biome.personnages.splice(exists, 1);
			$('#' + player.id).remove();
			console.log(game.biome.personnages);
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
		var loader = new THREE.JSONLoader();


		loader.load("/javascripts/objects/brothereyes.js", function (geometry, materials) {
			//correction de la couleur du 2 ieme matériel
			//materials[1].color = new THREE.Color("rgb(255,0,0)");

			//var texture = new THREE.ImageUtils.loadTexture("/javascripts/BROTHEREYE_DIFF.jpg");
			var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial(materials));
			mesh.position.x = parseInt(Math.random() * 100);
			mesh.position.y = parseInt(Math.random() * 100);
			mesh.scale.x = mesh.scale.y = mesh.scale.z = 4;
			scene.add(mesh);
		});
		/*fin du test*/
	})
});
