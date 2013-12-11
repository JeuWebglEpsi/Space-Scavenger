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
                mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 500 - 250;
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
Map.prototype.ship = function() {

this.name = "ship";

// Creation map en 2d
var map = [
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
[1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,],
[1,0,1,1,1,0,0,0,0,1,1,1,1,1,1,0,1,1,1,0,0,0,0,0,0,1,0,1,1,1,1,0,1,1,1,1,0,0,0,0,9,0,0,0,1,],
[1,0,0,0,1,1,1,1,0,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,0,1,1,1,1,0,1,1,1,1,0,0,0,0,0,0,0,0,1,],
[1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,],
[1,0,0,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,],
[1,0,1,1,1,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,],
[1,0,1,1,0,0,1,1,1,1,1,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,],
[1,0,1,1,0,1,1,1,1,1,1,0,0,0,0,0,1,1,0,1,1,0,0,0,1,1,1,1,1,0,1,1,0,0,0,1,1,1,1,0,1,1,1,1,1,],
[1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,0,0,0,1,0,1,1,1,1,0,0,0,1,1,1,],
[1,0,1,1,0,0,0,0,1,1,1,1,1,0,0,0,0,1,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,],
[1,0,0,0,1,1,1,0,1,1,1,0,0,0,1,1,0,1,0,0,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,0,0,0,1,1,1,],
[1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,],
[1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,1,1,1,1,1,1,],
[1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,],
[1,0,0,0,0,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,],
[1,0,0,0,0,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,0,1,1,],
[1,0,0,0,0,0,1,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,],
[1,0,1,1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,1,0,0,0,0,0,1,0,0,0,1,],
[1,0,0,1,0,0,0,0,1,1,1,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,0,0,0,0,0,1,],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
], mapW = map.length, mapH = map[0].length;


var units = mapW;
var UNITSIZE = 25;
var WALLHEIGHT = 25;
var FLOORHEIGHT = 2;




     var materials = [
                    // new THREE.MeshLambertMaterial({color: 0xEDCBA0}),
                    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('javascripts/Maps/cube1.png')}),
                    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')}),
                    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')}),
                    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')}),
                    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')}),
                    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')}),
                    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')}),
                    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')}),
                    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')}),
                    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('javascripts/Maps/cube1.png')}),
                     ];
    // Geometry: walls
    var cube = new THREE.CubeGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
    var cube_floor = new THREE.CubeGeometry(UNITSIZE, FLOORHEIGHT, UNITSIZE);
    var cube_roof = new THREE.CubeGeometry(UNITSIZE, FLOORHEIGHT, UNITSIZE);
    var loader = new THREE.JSONLoader();
    for (var i = mapW-1; i >= 0; i--) {
        for (var j = map[i].length-1; j >= 0; j--) {
            //generation des murs
            if (map[i][j] !== 0) {

                if (map[i][j] ===9) {

                    // console.log(map[i][j]);
                    // loader.load("/javascripts/Objects/robot.js", function (geometry, materials) {
                    //     var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
                    //     mesh.name = "mechantrobot";
                    //     mesh.position.x = ((i - units/2) * UNITSIZE ) - 212.5;
                    //     mesh.position.y = q0;
                    //     mesh.position.z = ((j - units/2) * UNITSIZE) + 212.5;
                    //     mesh.scale.y=mesh.scale.z=mesh.scale.x = 5;
                    //     scene.add(mesh);
                    // });

                var wall = new Physijs.BoxMesh(cube, materials[map[i][j]],1000000000);
                wall.position.x = ((i - units/2) * UNITSIZE ) - 212.5;
                wall.position.y = (WALLHEIGHT/2) - 5;
                wall.position.z = ((j - units/2) * UNITSIZE) + 212.5;
                wall.scale.y=wall.scale.z=wall.scale.x = 0.1;
                wall.name = "wall";
                wall.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            console.log('Wall ' + this.id + ' in collision with ' + other_object.id + ' ' + other_object.name);
        });
                scene.add(wall);
                }


                else{
                var wall = new Physijs.BoxMesh(cube, materials[map[i][j]],1000000000);
                wall.position.x = ((i - units/2) * UNITSIZE ) - 212.5;
                wall.position.y = (WALLHEIGHT/2) - 5;
                wall.position.z = ((j - units/2) * UNITSIZE) +212.5;
                scene.add(wall);
                }

            }

            if(map[i][j] === 0 || map[i][j] === 9){
                    //génération du sol
                    var floor = new Physijs.BoxMesh(cube_floor, materials[map[i][j]],1000000000);
                    floor.position.x = ((i - units/2) * UNITSIZE) - 212.5;
                    floor.position.y = (FLOORHEIGHT/2) - 5;
                    floor.position.z = ((j - units/2) * UNITSIZE) +212.5;;
                    scene.add(floor);

                    //génération du plafond
                    var roof = new Physijs.BoxMesh(cube_roof, materials[map[i][j]],1000000000);
                    roof.position.x = ((i - units/2) * UNITSIZE) - 212.5;
                    roof.position.y = (FLOORHEIGHT/2 + WALLHEIGHT) -  5;
                    roof.position.z = ((j - units/2) * UNITSIZE) + 212.5;
                    scene.add(roof);

            }

        }


        //console.log(Player);
        //Player.set('_position', new THREE.Vector3(0,0,0));

}

     //lesméchants
    loader.load("/javascripts/Objects/robot.js", function (geometry, materials) {
        var count = 10;
        while (count --){

        var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshFaceMaterial(materials));
        mesh.name = "mechantrobot";
       /* mesh.position.x = (i - units/2) * UNITSIZE;
        mesh.position.y = 5;
        mesh.position.z = (j - units/2) * UNITSIZE;*/
        mesh.position.x = Math.random() * 1000 - 500;
            mesh.position.y = 0;
            mesh.position.z = Math.random() * 1000 - 500;
            mesh.rotation.x = Math.random();
            mesh.rotation.y = Math.random();
            mesh.rotation.z = Math.random();
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 100;
        scene.add(mesh);
        }
    });

}
//Map updating function
Map.prototype.update = function () {
    var map = this;
    if (typeof map.particleSystem!== 'undefined')
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
