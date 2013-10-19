//déssinateur (peut etre a appeler avec un worker pour de meilleur performances...)
$(document).ready(function () {
	window.scene = new THREE.Scene();
	window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);

	window.renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	$('body').append(renderer.domElement);

	//maintenant on va ajouter un objet créé avec blender
	var loader = new THREE.JSONLoader();

	//background image
	loader.load("/javascripts/objects/bgd.js", function (geometry, materials) {
		var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
		mesh.position.x = 0;
		mesh.position.y = 0
		mesh.scale.x = mesh.scale.y = mesh.scale.z = -3;
		scene.add(mesh);
	});

	var meshs = [];
	// on ajoute un point de lumière
	var light = new THREE.PointLight(0xffffff, 50, 5000);
	var light2 = new THREE.AmbientLight(0xffffff);
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(1, 1, 1).normalize();
	scene.add(directionalLight);
	light.position.set(0, 0, 0);
	scene.add(light)
	scene.add(light2);
	//on change la position de la caméra
	camera.position.z = camera.position.y = camera.position.x = 0;

	// create the particle variables
	var particleCount = 1800,
		particles = new THREE.Geometry();
	// create the particle variables
	var pMaterial = new THREE.ParticleBasicMaterial({
		color: 0xFFFFFF,
		size: 1,
		map: THREE.ImageUtils.loadTexture(
			"/javascripts/objects/particle.png"
		),
		blending: THREE.AdditiveBlending,
		transparent: true,
		fog: true
	});

	// also update the particle system to
	// sort the particles which enables
	// the behaviour we want
	//particleSystem.sortParticles = true;

	var pcount = particleCount;
	// now create the individual particles
	while (pcount--) {

		// create a particle with random
		// position values, -250 -> 250
		var pX = Math.random() * 500 - 250,
			pY = Math.random() * 500 - 250,
			pZ = Math.random() * 500 - 250,
			particle = new THREE.Vector3(pX, pY, pZ);
		particle.velocity = new THREE.Vector3(
			0, // x
			-Math.random(), // y: random vel
			0);

		// add it to the geometry
		particles.vertices.push(particle);
	}

	// create the particle system
	var particleSystem = new THREE.ParticleSystem(
		particles,
		pMaterial);

	// add it to the scene
	scene.add(particleSystem);

	renderer.shadowMapEnabled = true;

	//fonction qui lance le rendu
	var render = function () {
		requestAnimationFrame(render);

		// on tourne les particules
		particleSystem.rotation.y += 0.0001;

		renderer.render(scene, camera);
	};
	render();
})
