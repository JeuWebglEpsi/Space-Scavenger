$(document).ready(function () {
	// var scene = new THREE.Scene();
	// var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	// var renderer = new THREE.WebGLRenderer();
	// renderer.setSize(window.innerWidth, window.innerHeight);
	// $('body').append(renderer.domElement);

	// var cubes = [];
	// game.biome.personnages.forEach(function (personnage) {
	// 	var geometry = new THREE.CubeGeometry(1, 1, 1);
	// 	var material = new THREE.MeshBasicMaterial({
	// 		color: 'red'
	// 	});
	// 	var cube = new THREE.Mesh(geometry, material);
	// 	cubes.push(cube);
	// 	scene.add(cube);
	// })


	// camera.position.z = 5;
	// // white spotlight shining from the side, casting shadow

	// var spotLight = new THREE.SpotLight(0xffffff);
	// spotLight.position.set(100, 1000, 100);

	// spotLight.castShadow = true;

	// spotLight.shadowMapWidth = 1024;
	// spotLight.shadowMapHeight = 1024;

	// spotLight.shadowCameraNear = 500;
	// spotLight.shadowCameraFar = 4000;
	// spotLight.shadowCameraFov = 30;

	// scene.add(spotLight);

	// function render() {
	// 	requestAnimationFrame(render);
	// 	cubes.forEach(function (cube) {
	// 		cube.rotation.x += 0.05;
	// 		if (Math.random() - .5 > 0) {
	// 			cube.position.x += Math.random();
	// 		} else {
	// 			cube.position.x -= Math.random();
	// 		}
	// 	})
	// 	renderer.render(scene, camera);
	// }
	// render();

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	var renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	$('body').append(renderer.domElement);

	//maintenant on va ajouter un objet créé avec blender
	var loader = new THREE.JSONLoader();
	var meshs = [];
	loader.load("/javascripts/objects/brothereyes.js", function (geometry, materials) {

		//correction de la couleur du 2 ieme matériel
		//materials[1].color = new THREE.Color("rgb(255,0,0)");

		//var texture = new THREE.ImageUtils.loadTexture("/javascripts/BROTHEREYE_DIFF.jpg");
		var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial(materials));
		mesh.position.x = 0;
		mesh.position.y = -50;
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 10;
		scene.add(mesh);
		meshs.push(mesh);

	});
	// on ajoute un point de lumière
	var light = new THREE.PointLight(0xffffff, 1, 500);
	light.position.set(8, 2, 8);
	scene.add(light)
	//on change la position de la caméra
	camera.position.z = 200;

	var render = function () {
		requestAnimationFrame(render);
		meshs.forEach(function (mesh) {
			mesh.rotation.y += 0.05;
			mesh.rotation.z += 0.02;
		})
		renderer.render(scene, camera);
	};

	render();
})
