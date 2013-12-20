var Map = function () {
    var map = this;
    var initialized = false;
    var currentLevel;
    var walls = [];
    var obstacles = [];
    this.asteroids = [];
    this.particleSystem;
    this.increment = -1;
    //map logic
    this.levelSpace = {
        goals: ['reach', 'collect', 'reach2', 'win'],
        texts: ['Atteignez la porte du vaisseau.', 'Trouvez un levier dans les astéroïdes', 'Rejoignez le vaisseau', '']
    }
    this.levelShip = {
        goals: ['reach', 'collect', 'reach2', 'win'],
        texts: ['Atteignez la porte du vaisseau.', 'Trouvez un levier dans les astéroïdes', 'Rejoignez le vaisseau']
    }
    this.currentProgress = {
        completed: -1,
        goal: null,
        texts: null
    }
};
//space logic
Map.prototype.progressSpace = function () {
    var map = this;

    this.currentProgress.completed++;
    this.currentProgress.goal = this.levelSpace.goals[this.currentProgress.completed];
    this.currentProgress.texts = this.levelSpace.texts[this.currentProgress.completed];

    if (this.currentProgress.goal === "win") {
        window.game.YouWin();
    }
    window.game.localPlayer.ath.drawGoals(this.currentProgress);
}

Map.prototype.space = function () {
    var map = this;
    'use strict';
    this.currentProgress = {
        completed: -1,
        goal: null,
        texts: null
    }
    this.currentLevel = 'space';
    console.log('map initializing')
    window.scene.setGravity(new THREE.Vector3(0, 0, 0));
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
        var asteroidCount = 800;
        var veryBigAste = 1;
        var bigAste = 200;
        var weight;
        while (asteroidCount--) {
            if (veryBigAste-- > 0) {
                weight = Math.abs(Math.random() * 500 - 250);
            } else if (bigAste-- > 0) {
                weight = Math.abs(Math.random() * 100 - 50);
            } else {
                weight = Math.abs(Math.random() * 50 - 1);
            }
            var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshFaceMaterial(materials), 10000 * weight);
            mesh.position.x = Math.random() * 12000 - 6000;
            mesh.position.y = Math.random() * 1000 - 500;
            mesh.position.z = Math.random() * 12000 - 6000;
            mesh.rotation.x = Math.random();
            mesh.rotation.y = Math.random();
            mesh.rotation.z = Math.random();

            mesh.receiveShadow = true;
            mesh.castShadow = true;
            mesh.scale.x = mesh.scale.y = mesh.scale.z = weight;

            mesh.name = "asteroid";
            mesh.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                // console.log('asteroid ' + this.id + ' in collision with ' + other_object.id + ' ' + other_object.name);
            });
            scene.add(mesh);
        }
    });


    loader.load('/javascripts/Maps/ship.js', function (geometry, materials) {
        var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshFaceMaterial(materials), 1e10);
        mesh.rotation.z += 2;
        mesh.rotation.y += 2;
        mesh.rotation.x = 0;
        mesh.material.shading = THREE.FlatShading;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 20;
        mesh.scale.x = 30;
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.position.set(0, 0, -3000);
        scene.add(mesh);
        mesh.addEventListener('collision', function (other_object) {
            if (other_object.name === "cameraCollider") {
                if (map.currentProgress.goal === 'reach' || map.currentProgress.goal === 'reach2')
                    map.progressSpace();
            }
        })
    })
    // on ajoute un point de lumière

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
    var particleCount = 20000,
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
        var pX = Math.random() * 100000 - 50000,
            pY = Math.random() * 100000 - 50000,
            pZ = Math.random() * 100000 - 50000,
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
Map.prototype.progressShip = function () {

}
Map.prototype.ship = function () {

    this.currentProgress = {
        completed: -1,
        goal: null,
        texts: null
    }
    this.currentLevel = 'ship';

    window.scene.setGravity(new THREE.Vector3(0, -10, 0));

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
    var map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
        [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, ],
        [1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 9, 0, 0, 0, 1, ],
        [1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, ],
        [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, ],
        [1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 2, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, ],
        [1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, ],
        [1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 0, 0, 9, 0, 0, 0, 9, 1, 9, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, ],
        [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 9, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, ],
        [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, ],
        [1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, ],
        [1, 0, 0, 0, 1, 1, 1, 0, 1, 2, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, ],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 9, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, ],
        [1, 1, 1, 9, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, ],
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
            map: THREE.ImageUtils.loadTexture('/javascripts/Maps/metal_floor_texture-200513-SM.jpg'),

        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('/javascripts/Maps/shiphull.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('/javascripts/Maps/shiphull-raye.png')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('/javascripts/Maps/shiphull.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('/javascripts/Maps/shiphull.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('/javascripts/Maps/shiphull.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('/javascripts/Maps/shiphull.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('/javascripts/Maps/shiphull.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('/javascripts/Maps/shiphull.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('/javascripts/Maps/metal_floor_texture-200513-SM.jpg')
        }),
    ];
    // Geometry: walls
    var cube = new THREE.CubeGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
    var cube_floor = new THREE.CubeGeometry(UNITSIZE, FLOORHEIGHT, UNITSIZE);
    var cube_roof = new THREE.CubeGeometry(UNITSIZE, FLOORHEIGHT, UNITSIZE);
    //var scene = new THREE.Object3D();

    var robot_mechant = new EnemyManage();

    for (var i = mapW - 1; i >= 0; i--) {
        for (var j = map[i].length - 1; j >= 0; j--) {
            //generation des murs
            if (map[i][j] === 1 || map[i][j] === 2) {

                    var wall = new Physijs.BoxMesh(cube, materials[map[i][j]], 0);
                    wall.position.x = ((i - units / 2) * UNITSIZE) ;
                    wall.position.y = (WALLHEIGHT / 2);
                    wall.position.z = ((j - units / 2) * UNITSIZE);
                    wall.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                        // console.log('asteroid ' + this.id + ' in collision with ' + other_object.id + ' ' + other_object.name);
                        console.log("mur touche");
                    });
                    scene.add(wall);
                

            }

            if (map[i][j] === 0 || map[i][j] === 9) {
                //génération du sol
                var floor = new Physijs.BoxMesh(cube_floor, materials[map[i][j]], 0);
                floor.position.x = ((i - units / 2) * UNITSIZE);
                floor.position.y = 0;
                floor.position.z = ((j - units / 2) * UNITSIZE);


                // A Deplacer dans la detection de collision

                //var munition = new Bullet();
                //munition.createLife(floor.position);



                scene.add(floor);

                //génération du plafond
                var roof = new Physijs.BoxMesh(cube_roof, materials[map[i][j]], 0);
                roof.position.x = ((i - units / 2) * UNITSIZE);
                roof.position.y = (FLOORHEIGHT / 2 + WALLHEIGHT);
                roof.position.z = ((j - units / 2) * UNITSIZE);
                scene.add(roof);


                if(map[i][j] === 9) {
                    robot_mechant.createEnemy(
                        (i - units / 2) * UNITSIZE,
                        0,
                        (j - units / 2) * UNITSIZE
                       );
                }

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

Map.prototype.createLoot = function (parent_object, type) {
    var map = this;
    var item, mesh, position, cube;

    position = parent_object.position;
    cube = new THREE.CubeGeometry(3, 3, 5);

    if (type === "life") {
        mesh = new Physijs.BoxMesh(cube,
            new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')
            }),
            0);
        mesh.position = position;
        mesh.position.y += 1;
        mesh.name = "toHighlight";

        mesh.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            var nbLife = Math.floor((Math.random() * 100) + 30);
            console.log(nbLife);
            if (game.localPlayer.get('_life') < 100) {
                scene.remove(this);
                if (game.localPlayer.get('_life') < (100 - nbLife)) {
                    game.localPlayer.set('_life', game.localPlayer.get('_life') + nbLife);
                } else {
                    game.localPlayer.set('_life', 100);
                }
            }
        });
    } else if (type === "ammo") {
        mesh = new Physijs.BoxMesh(cube,
            new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')
            }),
            0);
        mesh.name = "toHighlight";
        mesh.position = position;
        mesh.position.y += 1;

        mesh.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            var nbAmmo = Math.floor((Math.random() * 10) + 1);
            if (game.localPlayer.get('_ammo') < 100) {
                scene.remove(this);
                if (game.localPlayer.get('_ammo') < (100 - nbAmmo)) {
                    game.localPlayer.set('_ammo', game.localPlayer.get('_ammo') + nbAmmo);
                } else {
                    game.localPlayer.set('_ammo', 100);
                }
            }
        });

    } else if (type === "levier") {
        mesh = new Physijs.BoxMesh(cube,
            new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')
            }),
            0);
        mesh.name = "toHighlight";
        mesh.position = position;
        mesh.position.y += 1;

        mesh.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            if (map.currentProgress.goal === 'collect' && other_object.name === "cameraCollider")
                map.progressSpace();
        });

    }
    scene.add(mesh);
}

//Map updating function
Map.prototype.update = function () {
    var map = this;
    if (typeof map.particleSystem !== 'undefined')
        map.particleSystem.rotation.y += 0.0002;
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Map;
else
    window.Map = Map;
