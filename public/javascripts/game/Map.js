var Map = function () {
    var map = this;
    var walls = [];
    var obstacles = [];
    this.asteroids = [];
    this.particleSystem;

    /* ... */
};

Map.prototype.space = function () {
    var map = this;
    'use strict';
    console.log('map initializing')
    //maintenant on va ajouter un objet créé avec blender
    var loader = new THREE.JSONLoader();

    //background image
    loader.load("/javascripts/Maps/bgd2.js", function (geometry, materials) {
        var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshFaceMaterial(materials));
        mesh.name = "bgdCube";
        mesh.scale.x = mesh.scale.y = mesh.scale.z = -2000;
        scene.add(mesh);
    });


    loader.load("/javascripts/Maps/asteroid.js", function (geometry, materials) {
        var asteroidCount = 2000;
        var veryBigAste = 1;
        var bigAste = 200;
        while (asteroidCount--) {
            var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshFaceMaterial(materials), 10000);
            mesh.position.x = Math.random() * 10000 - 5000;
            mesh.position.y = Math.random() * 1000 - 500;
            mesh.position.z = Math.random() * 10000 - 5000;
            mesh.rotation.x = Math.random();
            mesh.rotation.y = Math.random();
            mesh.rotation.z = Math.random();
            if (veryBigAste-- > 0) {
                mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 500 - 300;
            } else if (bigAste-- > 0) {
                mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 100 - 50;
            } else {
                mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50 - 1;
            }
            mesh.name = "asteroid";
            mesh.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                // console.log('asteroid ' + this.id + ' in collision with ' + other_object.id + ' ' + other_object.name);
            });
            scene.add(mesh);
        }
    });

    // on ajoute un point de lumière


    var hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x000000, 1);
    scene.add(hemiLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-2000, 0, -200);

    scene.add(directionalLight);

    // create the particle variables
    var particleCount = 100000,
        particles = new THREE.Geometry()
        // create the particle variables
        var pMaterial = new THREE.ParticleBasicMaterial({
            color: 0xFFFFFF,
            size: 1.5,
            map: THREE.ImageUtils.loadTexture("/javascripts/Maps/particle.png"),
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
    map.particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    // add it to the scene
    scene.add(map.particleSystem);
}

//Map updating function
Map.prototype.update = function () {
    var map = this;
    map.particleSystem.rotation.y += 0.0002;
    var i = 0,
        mult = 0.005;
    scene.traverse(function (obj) {
        if (obj.name === "asteroid ") {
            if (i % 2 === 0) {
                obj.rotation.x += Math.random() * mult;
                obj.rotation.y += Math.random() * mult;
                obj.rotation.z += Math.random() * mult;
            } else {
                obj.rotation.x -= Math.random() * mult;
                obj.rotation.y -= Math.random() * mult;
                obj.rotation.z -= Math.random() * mult;
            }
            i++;
        }
    })
    // console.log('Map updating...');
}

Map.prototype.getObstacles = function () {
    'use strict';
    return map.obstacles.concat(map.walls);
}
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Map;
else
    window.Map = Map;
