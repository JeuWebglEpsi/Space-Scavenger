//déssinateur (peut etre a appeler avec un worker pour de meilleur performances...)
$(document).ready(function () {
	Physijs.scripts.worker = '/javascripts/core/lib/physijs_worker.js';

	window.scene = new Physijs.Scene;
	scene.setGravity(new THREE.Vector3(0, -30, 0));

	window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000000);

	window.renderer = new THREE.WebGLRenderer({
		antialias: true,
		precision: 'highp'
	});
	renderer.setSize(window.innerWidth, window.innerHeight);

	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	$('body').append(renderer.domElement);

	window.game = new Game();
	console.log(game);
	game.map.init();



	//fonction qui lance le rendu
	var render = function () {
		scene.simulate();
		requestAnimationFrame(render);

		// on tourne les particules
		game.map.particleSystem.rotation.y += 0.0002;

		renderer.render(scene, camera);
	};

	render();
})
