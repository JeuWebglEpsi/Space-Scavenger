//déssinateur (peut etre a appeler avec un worker pour de meilleur performances...)
$(document).ready(function () {
	window.scene = new THREE.Scene();
	window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	window.renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	$('body').append(renderer.domElement);

	//maintenant on va ajouter un objet créé avec blender
	var loader = new THREE.JSONLoader();
	var meshs = [];
	// on ajoute un point de lumière
	var light = new THREE.PointLight(0xffffff, 1, 500);
	var light2 = new THREE.AmbientLight(0xffffff);

	light.position.set(0, 200, 0);
	scene.add(light)
	scene.add(light2);
	//on change la position de la caméra
	camera.position.z = 200;


	//fonction qui lance le rendu
	var render = function () {
		requestAnimationFrame(render);

		renderer.render(scene, camera);
	};
	render();
})
