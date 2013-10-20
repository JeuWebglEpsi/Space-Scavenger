//déssinateur (peut etre a appeler avec un worker pour de meilleur performances...)
$(document).ready(function () {
	window.scene = new THREE.Scene();
	window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);

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

	renderer.shadowMapEnabled = true;

	//fonction qui lance le rendu
	var render = function () {
		requestAnimationFrame(render);

		// on tourne les particules
		game.map.particleSystem.rotation.y += 0.0001;

		renderer.render(scene, camera);
	};

	render();
})
