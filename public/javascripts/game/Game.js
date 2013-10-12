(function () {
	'use strict';
	window.game = {};
	game.biome = new Biome()
	game.localPlayer = new Personnage("Tommy", 100, 100, 'fire');
	game.biome.addInBiome(game.localPlayer);
	game.biome.addInBiome(new Personnage("banane", 100, 100, 'ice'));
	game.localPlayer._position.watch('x', function (id, oldVal, newVal) {
		core.socket.emit('moveX', game.localPlayer._position.x);
		return newVal;
	});
	game.localPlayer._position.watch('y', function (id, oldVal, newVal) {
		core.socket.emit('moveY', game.localPlayer._position.y);
		return newVal;
	});
	game.localPlayer._position.watch('z', function (id, oldVal, newVal) {
		core.socket.emit('moveZ', game.localPlayer._position.z);
		return newVal;
	});


	core.socket.on('moveX', function (player, x) {
		console.log(player + ' is moving x : ' + x);
	})
	core.socket.on('moveY', function (player, y) {
		console.log(player + ' is moving y : ' + y);
	})
})();
