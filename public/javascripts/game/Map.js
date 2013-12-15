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
        var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        mesh.name = "bgdCube";
        mesh.material.depthWrite = false;
        mesh.receiveShadow = false;
        mesh.scale.set(-2000, -2000, -2000);
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

            mesh.receiveShadow = true;
            mesh.castShadow = true;
            if (veryBigAste-- > 0) {
                mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.abs(Math.random() * 500 - 250);
            } else if (bigAste-- > 0) {
                mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.abs(Math.random() * 100 - 50);
            } else {
                mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.abs(Math.random() * 50 - 1);
            }
            mesh.name = "asteroid";
            mesh.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                // console.log('asteroid ' + this.id + ' in collision with ' + other_object.id + ' ' + other_object.name);
            });
            scene.add(mesh);
        }
    });

    // on ajoute un point de lumière
    scene.add(this.addLensFlare(-2000, 0, -200, 16000, '/javascripts/Maps/lensflare0.png'))

    var hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x000000, .4);
    hemiLight.castShadow = false;
    scene.add(hemiLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(-2000, 0, -200);
    directionalLight.castShadow = true;
    directionalLight.shadowMapWidth = directionalLight.shadowMapHeight = 1024 * 2;

    var d = 300;

    directionalLight.shadowCameraLeft = -d;
    directionalLight.shadowCameraRight = d;
    directionalLight.shadowCameraTop = d;
    directionalLight.shadowCameraBottom = -d;

    directionalLight.shadowCameraFar = 3500;
    directionalLight.shadowBias = -0.0001;
    directionalLight.shadowDarkness = 0.35;

    scene.add(directionalLight);
    // create the particle variables
    var particleCount = 50000,
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
Map.prototype.ship = function () {

    scene.setGravity(new THREE.Vector3(0, -10, 0));

    this.name = "ship";

    var loader = new THREE.JSONLoader();

    //background image
    loader.load("/javascripts/Maps/bgd2.js", function (geometry, materials) {
        var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        mesh.name = "bgdCube";
        mesh.material.depthWrite = false;
        mesh.receiveShadow = false;
        mesh.scale.set(-2000, -2000, -2000);
        scene.add(mesh);
    });


    var hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x000000, .5);
    hemiLight.castShadow = false;
    scene.add(hemiLight);

     var directionalLight = new THREE.DirectionalLight(0xffffff, .5);
    directionalLight.position.set(0, -2000, 0);
    directionalLight.castShadow = true;
    directionalLight.shadowMapWidth = directionalLight.shadowMapHeight = 1024 * 2;

    var d = 300;

    directionalLight.shadowCameraLeft = -d;
    directionalLight.shadowCameraRight = d;
    directionalLight.shadowCameraTop = d;
    directionalLight.shadowCameraBottom = -d;

    directionalLight.shadowCameraFar = 3500;
    directionalLight.shadowBias = -0.0001;
    directionalLight.shadowDarkness = 0.35;

    scene.add(directionalLight);


    // Creation map en 2d
    var map =   [
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
                    [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, ],
                    [1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 9, 0, 0, 0, 1, ],
                    [1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, ],
                    [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, ],
                    [1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 2, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, ],
                    [1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, ],
                    [1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, ],
                    [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, ],
                    [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, ],
                    [1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, ],
                    [1, 0, 0, 0, 1, 1, 1, 0, 1, 2, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, ],
                    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, ],
                    [1, 1, 1, 0, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, ],
                    [1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, ],
                    [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, ],
                    [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, ],
                    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, ],
                    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, ],
                    [1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, ],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
                ],
        mapW = map.length,
        mapH = map[0].length;


    var units = mapW;
    var UNITSIZE = 100;
    var WALLHEIGHT = 100;
    var FLOORHEIGHT = 2;



    var materials = [
        // new THREE.MeshLambertMaterial({color: 0xEDCBA0}),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/metal_floor_texture-200513-SM.jpg'),
            
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull-raye.png')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/cube1.png')
        }),
    ];
    // Geometry: walls
    var cube = new THREE.CubeGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
    var cube_floor = new THREE.CubeGeometry(UNITSIZE, FLOORHEIGHT, UNITSIZE);
    var cube_roof = new THREE.CubeGeometry(UNITSIZE, FLOORHEIGHT, UNITSIZE);
    //var scene = new THREE.Object3D();

    //var correction = 212.5;
    var correction = 100;
    var correctionY = 30;

    for (var i = mapW - 1; i >= 0; i--) {
        for (var j = map[i].length - 1; j >= 0; j--) {
            //generation des murs
            if (map[i][j] !== 0) {

                if (map[i][j] === 9) {


                } else {
                    var wall = new Physijs.BoxMesh(cube, materials[map[i][j]], 0);
                    wall.position.x = ((i - units / 2) * UNITSIZE) - correction;
                    wall.position.y = (WALLHEIGHT / 2) - correctionY;
                    wall.position.z = ((j - units / 2) * UNITSIZE) + correction;
                    wall.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                // console.log('asteroid ' + this.id + ' in collision with ' + other_object.id + ' ' + other_object.name);
            //console.log("mur touche");
        });
                    scene.add(wall);
                }

            }

            if (map[i][j] === 0 || map[i][j] === 9) {
                //génération du sol
                var floor = new Physijs.BoxMesh(cube_floor, materials[map[i][j]], 0);
                floor.position.x = ((i - units / 2) * UNITSIZE) - correction;
                floor.position.y = (FLOORHEIGHT / 2) - correctionY;
                floor.position.z = ((j - units / 2) * UNITSIZE) + correction;


                

                // A Deplacer dans la detection de collision 
               
                var munition = new Bullet();
                munition.createLife(floor.position);
         


                scene.add(floor);

                //génération du plafond
                var roof = new Physijs.BoxMesh(cube_roof, materials[map[i][j]], 0);
                roof.position.x = ((i - units / 2) * UNITSIZE) - correction;
                roof.position.y = (FLOORHEIGHT / 2 + WALLHEIGHT) - correctionY;
                roof.position.z = ((j - units / 2) * UNITSIZE) + correction;
                scene.add(roof);

            }

        }

        // var i = 100;

        // var cube_ammo = new THREE.CubeGeometry(1, 1, 2);
        // while (i--) {


                        


        // }
        //scene.add(group);
        //console.log(Player);
        //Player.set('_position', new THREE.Vector3(0,0,0));

    }

    //lesméchants
    // loader.load("/javascripts/Objects/robot.js", function (geometry, materials) {
    //     var count = 10;
    //     while (count--) {

    //         var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshFaceMaterial(materials));
    //         mesh.name = "mechantrobot";
    //          mesh.position.x = (i - units/2) * UNITSIZE;
    //     mesh.position.y = 5;
    //     mesh.position.z = (j - units/2) * UNITSIZE;
    //         mesh.position.x = Math.random() * 1000 - 500;
    //         mesh.position.y = 0;
    //         mesh.position.z = Math.random() * 1000 - 500;
    //         mesh.rotation.x = Math.random();
    //         mesh.rotation.y = Math.random();
    //         mesh.rotation.z = Math.random();
    //         mesh.scale.x = mesh.scale.y = mesh.scale.z = 100;
    //         scene.add(mesh);
    //     }
    // });

}

Map.prototype.addLensFlare = function (x, y, z, size, overrideImage) {
    var flareColor = new THREE.Color(0xffffff);

    lensFlare = new THREE.LensFlare(overrideImage, 700, 0.0, THREE.AdditiveBlending, flareColor);
    var textureFlare1, textureFlare2;
    textureFlare1 = THREE.ImageUtils.loadTexture('/javascripts/Maps/lensflare0.png')
    textureFlare2 = THREE.ImageUtils.loadTexture('/javascripts/Maps/lensflare2.png')
    //    we're going to be using multiple sub-lens-flare artifacts, each with a different size
    lensFlare.add(textureFlare1, 4096, 0.0, THREE.AdditiveBlending);
    lensFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);
    lensFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);
    lensFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);

    //    and run each through a function below
    lensFlare.customUpdateCallback = this.lensFlareUpdateCallback;

    lensFlare.position = new THREE.Vector3(x, y, z);
    lensFlare.size = size ? size : 16000;
    return lensFlare;
}

//  this function will operate over each lensflare artifact, moving them around the screen
Map.prototype.lensFlareUpdateCallback = function (object) {
    var f, fl = this.lensFlares.length;
    var flare;
    var vecX = -this.positionScreen.x * 2;
    var vecY = -this.positionScreen.y * 2;
    var size = object.size ? object.size : 16000;

    var camDistance = window.camera.position.length();

    for (f = 0; f < fl; f++) {
        flare = this.lensFlares[f];

        flare.x = this.positionScreen.x + vecX * flare.distance;
        flare.y = this.positionScreen.y + vecY * flare.distance;

        flare.scale = size / camDistance;
        flare.rotation = 0;
    }
}
//Map updating function
Map.prototype.update = function () {
    var map = this;
    if (typeof map.particleSystem !== 'undefined')
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
