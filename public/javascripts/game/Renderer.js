$(document).ready(function () {
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	$('body').append(renderer.domElement);

	var cubes = [];
	game.biome.personnages.forEach(function (personnage) {
		var geometry = new THREE.CubeGeometry(1, 1, 1);
		var material = new THREE.MeshBasicMaterial({
			color: 'red'
		});
		var cube = new THREE.Mesh(geometry, material);
		cubes.push(cube);
		scene.add(cube);
	})


	camera.position.z = 5;
	// white spotlight shining from the side, casting shadow

	var spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(100, 1000, 100);

	spotLight.castShadow = true;

	spotLight.shadowMapWidth = 1024;
	spotLight.shadowMapHeight = 1024;

	spotLight.shadowCameraNear = 500;
	spotLight.shadowCameraFar = 4000;
	spotLight.shadowCameraFov = 30;

	scene.add(spotLight);

	function render() {
		requestAnimationFrame(render);
		cubes.forEach(function (cube) {
			cube.rotation.x += 0.05;
			if (Math.random() - .5 > 0) {
				cube.position.x += Math.random();
			} else {
				cube.position.x -= Math.random();
			}
		})
		renderer.render(scene, camera);
	}
	render();
})
