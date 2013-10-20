//gestion des maps
(function () {
	'use strict';
	var Map = function () {
		var map = this;
		var walls = [];
		var obstacles = [];
		/* ... */
	};
	Map.prototype.init = function () {
		'use strict';
		console.log('map initializing')
		//maintenant on va ajouter un objet créé avec blender
		var loader = new THREE.JSONLoader();

		//background image
		loader.load("/javascripts/Maps/bgd.js", function (geometry, materials) {
			var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
			mesh.position.x = 0;
			mesh.position.y = 0
			mesh.scale.x = mesh.scale.y = mesh.scale.z = -100;
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
		var particleCount = 3600,
			particles = new THREE.Geometry();
		// create the particle variables
		var pMaterial = new THREE.ParticleBasicMaterial({
			color: 0xFFFFFF,
			size: .8,
			map: THREE.ImageUtils.loadTexture(
				"/javascripts/Maps/particle.png"
			),
			blending: THREE.AdditiveBlending,
			transparent: true
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
			var pX = Math.random() * 1000 - 250,
				pY = Math.random() * 1000 - 250,
				pZ = Math.random() * 1000 - 250,
				particle = new THREE.Vector3(pX, pY, pZ);
			particle.velocity = new THREE.Vector3(
				0, // x
				-Math.random(), // y: random vel
				0);

			// add it to the geometry
			particles.vertices.push(particle);
		}

		// create the particle system
		this.particleSystem = new THREE.ParticleSystem(
			particles,
			pMaterial);

		// add it to the scene
		scene.add(this.particleSystem);

		renderer.shadowMapEnabled = true;


	}
	Map.prototype.getObstacles = function () {
		'use strict';
		return this.obstacles.concat(this.walls);
	}
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
		module.exports = Map;
	else
		window.Map = Map;
})()
