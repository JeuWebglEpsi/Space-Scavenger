//GEstion des evenements clavier
(function () {
	'use strict';
	//permet la répétition des touches(maintenir pour se déplacer)
	kd.run(function () {
		kd.tick();
	});

	//up
	kd.Z.down(function () {
		game.localPlayer.moveUpX();
	});
	//left
	kd.Q.down(function () {
		game.localPlayer.moveDownY();
	});
	//right
	kd.D.down(function () {
		game.localPlayer.moveUpY();
	});
	//down
	kd.S.down(function () {
		game.localPlayer.moveDownX();
	});
})()
