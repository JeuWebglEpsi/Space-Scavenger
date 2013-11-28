var Map = function () {
    var map = this;
    var walls = [];
    var obstacles = [];

    /* ... */
};

Map.prototype.space = function () {
    'use strict';
    console.log('map initializing')
    //maintenant on va ajouter un objet créé avec blender
    var loader = new THREE.JSONLoader();

    //background image
    loader.load("/javascripts/Maps/bgd2.js", function (geometry, materials) {
        var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshFaceMaterial(materials));
        mesh.name = "bgd";
        mesh.position.x = 0;
        mesh.position.y = 0
        mesh.scale.x = mesh.scale.y = mesh.scale.z = -200;
        scene.add(mesh);
    });


    loader.load("/javascripts/Maps/asteroid.js", function (geometry, materials) {

        var asteroidCount = 10000;
        while (asteroidCount--) {
            var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshFaceMaterial(materials));
            mesh.position.x = Math.random() * 10000 - 5000;
            mesh.position.y = Math.random() * 10000 - 5000;
            mesh.position.z = Math.random() * 10000 - 5000;
            mesh.rotation.x = Math.random();
            mesh.rotation.y = Math.random();
            mesh.rotation.z = Math.random();
            mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 10 - 1;
            scene.add(mesh);
        }
    });
    // on ajoute un point de lumière
    var light = new THREE.AmbientLight(0xffffff);

    console.log(light);
    scene.add(light);

    // create the particle variables
    var particleCount = 400000,
        particles = new THREE.Geometry()
        // create the particle variables
        var pMaterial = new THREE.ParticleBasicMaterial({
            color: 0xFFFFFF,
            size: 1.5,
            map: THREE.ImageUtils.loadTexture(
                "/javascripts/Maps/particle.png"
            ),
            blending: THREE.AdditiveBlending,
            transparent: true
        });


    var pcount = particleCount;
    // now create the individual particles
    while (pcount--) {

        // create a particle with random
        // position values, -250 -> 250
        var pX = Math.random() * 10000 - 5000,
            pY = Math.random() * 10000 - 5000,
            pZ = Math.random() * 10000 - 5000,
            particle = new THREE.Vector3(pX, pY, pZ);


        // add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    this.particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    // add it to the scene
    scene.add(this.particleSystem);
}

//Map updating function
Map.prototype.update = function () {
    var map = this;
    this.particleSystem.rotation.y += 0.0002;
    // console.log('Map updating...');
}

Map.prototype.getObstacles = function () {
    'use strict';
    return this.obstacles.concat(this.walls);
}
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Map;
else
    window.Map = Map;
