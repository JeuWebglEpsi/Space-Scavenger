/**
 * Classe de gesion des maps
 */
var Map = function () {
    var map = this;
    var initialized = false;
    var currentLevel;
    this.robot_mechant = new EnemyManage();
    var walls = [];
    var obstacles = [];
    this.asteroids = [];
    this.particleSystem;
    this.increment = -1;
    this.ship_map = [];
    this.command_wall = [];
    //map logic
    this.levelSpace = {
        goals: ['reach', 'collect', 'reach2', 'win'],
        texts: ['Atteignez la porte du vaisseau.', 'Trouvez un levier dans les astéroïdes', 'Rejoignez le vaisseau', '']
    }
    this.levelShip = {
        goals: ['collect', 'escape', 'reach', 'desactivate', 'escape2', 'win'],
        texts: ['Récupérer suffisamment d\'énergie', 'Vous avez assez d\'énergie, vous pouvez sortir du vaisseau', 'La porte est verrouillée. Trouvez la salle des commandes et déverrouillez la porte.', 'La porte est déverrouillée, vous pouvez sortir du vaisseau', '']
    }
    this.currentProgress = {
        completed: -1,
        goal: null,
        texts: null
    }
};
/**
 * Fonction de logique de jeu niveau 1
 * @return {nothing}
 */
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
/**
 * Fonction de génération de l'espace
 * @return {nothing}
 */
Map.prototype.space = function () {
    var map = this;
    'use strict';
    window.controls.canMoveVertival = true;
    this.currentProgress = {
        completed: -1,
        goal: null,
        texts: null
    }
    this.currentLevel = 'space';
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

    var planete = new THREE.Mesh(new THREE.SphereGeometry(4000, 64, 64),
        new THREE.ShaderMaterial({
            uniforms: {
                color: 0xffd700
            },
            vertexShader: document.getElementById('vertexShaderBullet').textContent,
            fragmentShader: document.getElementById('fragmentShaderBullet').textContent,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        }));

    planete.position.set(-12000, 0, -200);
    scene.add(planete);

    loader.load("/javascripts/Maps/asteroid.js", function (geometry, materials) {
        var asteroidCount = 1000;
        var veryBigAste = 10;
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
                if (other_object.name === "cameraCollider")
                    window.game.localPlayer.set('_life', window.game.localPlayer.get('_life') - 20);

            });
            scene.add(mesh);
        }
    });


    loader.load('/javascripts/Maps/ship.js', function (geometry, materials) {

        var mirrorCamera = new THREE.CubeCamera(0.1, 5000, 512);

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


    var directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(-12000, 0, -200);
    directionalLight.castShadow = true;
    directionalLight.shadowMapWidth = directionalLight.shadowMapHeight = 1024 * 2;

    var d = 300000;

    directionalLight.shadowCameraLeft = -d;
    directionalLight.shadowCameraRight = d;
    directionalLight.shadowCameraTop = d;
    directionalLight.shadowCameraBottom = -d;

    directionalLight.shadowCameraFar = 350000;
    directionalLight.shadowBias = 0.001;
    directionalLight.shadowDarkness = .35;

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

/**
 * Fonction de logique de jeu du niveau 2
 * @return {[nothing]}
 */
Map.prototype.progressShip = function () {
    var map = this;

    this.currentProgress.completed++;
    this.currentProgress.goal = this.levelShip.goals[this.currentProgress.completed];
    this.currentProgress.texts = this.levelShip.texts[this.currentProgress.completed];

    if (this.currentProgress.goal === "win") {
        window.game.YouWin();
    }
    window.game.localPlayer.ath.drawGoals(this.currentProgress);
}



/**
 * Fonction de génération du niveau 2
 * @return {nothing}
 */
Map.prototype.ship = function () {
    var map = this;

    // Modification de la vitesse de déplacement
    window.controls.movementSpeed = 500;
    window.controls.canMoveVertival = false;


    // Initialisation de la progression
    this.currentProgress = {
        completed: -1,
        goal: null,
        texts: null
    }

    this.currentLevel = 'ship';

    window.scene.setGravity(new THREE.Vector3(0, -30, 0));


    // Creation map en 2d
    this.ship_map = [
        // Initialisation des variables de dimension pour la création des mesh de terrains
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
        [1, 1, 0, 8, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 9, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, ],
        [1, 1, 0, 0, 0, 1, 1, 1, 9, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 9, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 9, 0, 0, 0, 0, 9, 0, 0, 0, 0, 1, ],
        [1, 1, 1, 4, 1, 1, 1, 1, 0, 1, 1, 0, 9, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 9, 1, 0, 9, 1, 0, 0, 9, 1, 0, 9, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 9, 0, 5, 0, 0, 0, 0, 9, 0, 6, 0, 9, 0, 0, 1, ],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 9, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, ],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 9, 0, 0, 9, 0, 9, 0, 0, 0, 1, ],
        [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, ],
        [1, 1, 1, 1, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
        [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 8, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 9, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
        [1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
        [1, 1, 0, 8, 0, 4, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
        [1, 1, 0, 0, 0, 1, 1, 1, 9, 1, 1, 0, 0, 0, 9, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 9, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 9, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, ],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 9, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 9, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 9, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, ],
        [1, 9, 0, 0, 8, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, ],
        [1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 8, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, ],
        [1, 0, 1, 10, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 8, 0, 1, ],
        [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
    ];
    var mapH = this.ship_map[0].length;
    var mapW = this.ship_map.length;


    var units = mapW;
    var UNITSIZE = 100;
    var WALLHEIGHT = 100;
    var FLOORHEIGHT = 2;



    var materials = [
        // new THREE.MeshLambertMaterial({color: 0xEDCBA0}),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/metal_floor_texture-200513-SM.jpg') //0 Sol + plafond
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg') //1 Mur normal
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull-raye.png') //2 Mur raye
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull-Porte1.jpg') //3 Porte D'entrée
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull-Porte2.jpg') //4 Porte cassable
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull-Porte3.jpg') //5 Porte cible
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg') // 6 super mechant
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/console.jpg') // 7 poste de controle
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg') // 8 energy
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/metal_floor_texture-200513-SM.jpg') // Méchant
        })
    ];


    // Geometry: walls
    var cube = new THREE.CubeGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
    var cube_floor = new THREE.CubeGeometry(UNITSIZE, FLOORHEIGHT, UNITSIZE);
    var cube_roof = new THREE.CubeGeometry(UNITSIZE, FLOORHEIGHT, UNITSIZE);
    //var scene = new THREE.Object3D();

    //var robot_mechant = new EnemyManage();
    var mechantCount = 0;
    for (var i = mapW - 1; i >= 0; i--) {
        for (var j = this.ship_map[i].length - 1; j >= 0; j--) {
            //generation des murs
            if (this.ship_map[i][j] === 1 || this.ship_map[i][j] === 2 || this.ship_map[i][j] === 3 // Porte d'entrée
                || this.ship_map[i][j] === 4 //Porte fragile
                || this.ship_map[i][j] === 5) // Porte sécurisé
            {
                if (this.ship_map[i][j] === 3) {
                    var wall = new Physijs.BoxMesh(cube, materials[this.ship_map[i][j]], 0);
                    wall._physijs.collision_flags = 0
                    wall.position.x = ((i - units / 2) * UNITSIZE);
                    wall.position.y = (WALLHEIGHT / 2);
                    wall.position.z = ((j - units / 2) * UNITSIZE);

                    wall.name = 'Door';
                    wall.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                        // console.log('asteroid ' + this.id + ' in collision with ' + other_object.id + ' ' + other_object.name);

                        if (other_object.name === 'cameraCollider') {

                            if (map.currentProgress.goal === 'escape') {
                                map.progressShip(); //et ensuite détruire la porte finale

                                while (map.command_wall.length > 0) {
                                    scene.remove(map.command_wall[0]);
                                    map.command_wall.shift();
                                }
                            } else if (map.currentProgress.goal === 'escape2') {
                                map.progressShip(); //et fin de la partie
                            }
                        }

                    });
                    scene.add(wall);
                } else if (this.ship_map[i][j] === 4) {
                    var wall = new Physijs.BoxMesh(cube, materials[this.ship_map[i][j]], 0);
                    wall._physijs.collision_flags = 0
                    wall.position.x = ((i - units / 2) * UNITSIZE);
                    wall.position.y = (WALLHEIGHT / 2);
                    wall.position.z = ((j - units / 2) * UNITSIZE);

                    wall.life = 3;
                    wall.name = 'wall_breakable';
                    wall.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                        //console.log('mur cassable ' + this.id + ' in collision with ' + other_object.id + ' ' + other_object.name);
                        if (other_object.name === "bullet") {
                            console.log(--this.life);
                            if (this.life === 0)
                                scene.remove(this);
                        }
                        //window.Utils.collision_action_perform(this, other_object, relative_velocity, relative_rotation, contact_normal);

                    });
                    scene.add(wall);
                } else if (this.ship_map[i][j] === 5) {
                    var wall = new Physijs.BoxMesh(cube, materials[this.ship_map[i][j]], 0);
                    wall._physijs.collision_flags = 0
                    wall.position.x = ((i - units / 2) * UNITSIZE);
                    wall.position.y = (WALLHEIGHT / 2);
                    wall.position.z = ((j - units / 2) * UNITSIZE);

                    wall.name = "LockedDoor";
                    map.command_wall.push(wall);
                    scene.add(wall);
                }

                if (this.ship_map[i][j] === 1 || this.ship_map[i][j] === 2) {
                    var wall = new Physijs.BoxMesh(cube, materials[this.ship_map[i][j]], 0);
                    wall._physijs.collision_flags = 0
                    wall.position.x = ((i - units / 2) * UNITSIZE);
                    wall.position.y = (WALLHEIGHT / 2);
                    wall.position.z = ((j - units / 2) * UNITSIZE);

                    wall.name = 'wall';
                    // wall.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                    //     console.log("mur touche");
                    // });
                    scene.add(wall);
                }


            }
            if (this.ship_map[i][j] === 0 || this.ship_map[i][j] === 4 || this.ship_map[i][j] === 5 || this.ship_map[i][j] === 6 || this.ship_map[i][j] === 7 || this.ship_map[i][j] === 8 || this.ship_map[i][j] === 9 || this.ship_map[i][j] === 10

            ) {
                //génération du sol
                var floor = new Physijs.BoxMesh(cube_floor, materials[0], 0, {
                    collision_flags: 3
                });
                floor.addEventListener('collision', function (other_object) {

                })
                floor.position.x = ((i - units / 2) * UNITSIZE);
                floor.position.y = (FLOORHEIGHT / 2);
                floor.position.z = ((j - units / 2) * UNITSIZE);
                scene.add(floor);

                //génération du plafond
                var roof = new Physijs.BoxMesh(cube_roof, materials[0], 0, {
                    collision_flags: 3
                });
                roof.position.x = ((i - units / 2) * UNITSIZE);
                roof.position.y = (FLOORHEIGHT / 2 + WALLHEIGHT);
                roof.position.z = ((j - units / 2) * UNITSIZE);
                scene.add(roof);

                if (this.ship_map[i][j] === 9) {
                    map.robot_mechant.createEnemy(
                        (i - units / 2) * UNITSIZE, -12, (j - units / 2) * UNITSIZE, mechantCount);
                    mechantCount++;

                } else if (this.ship_map[i][j] === 6) { // creation super mechant
                    map.robot_mechant.createSuperEnemy(
                        (i - units / 2) * UNITSIZE, -20, (j - units / 2) * UNITSIZE, mechantCount);
                    mechantCount++;
                } else if (this.ship_map[i][j] === 8) { // creation cellule energie

                    this.createLoot(floor, 'energy');
                } else if (this.ship_map[i][j] === 7) { // creation du poste de control


                    var computer = new Physijs.BoxMesh(
                        new THREE.CubeGeometry(10, 30, 10),
                        new THREE.MeshLambertMaterial({
                            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull-Porte2.jpg') //4 Porte cassable
                        }), 0);

                    computer.position = floor.position;

                    computer.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                        if (other_object.name === "cameraCollider") {
                            if (map.currentProgress.goal === 'desactivate')
                                map.progressShip();
                        }

                    });

                    scene.add(computer);
                } else if (this.ship_map[i][j] === 10) { //ajout caisse de munition
                    var bullet = new Bullet();
                    bullet.create_ammobox(floor.position);

                }

            }

        }

    }



}
//à déplacer dans Utils
Map.prototype.createLoot = function (parent_object, type) {
    var map = this;
    var item, mesh, position, cube;

    position = parent_object.position;
    cube = new THREE.CubeGeometry(20, 20, 35);

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
            if (other_object.name === 'cameraCollider') {

                var nbLife = Math.floor((Math.random() * 100) + 40);
                if (game.localPlayer.get('_life') < 100) {
                    scene.remove(this);
                    if (game.localPlayer.get('_life') < (100 - nbLife)) {
                        game.localPlayer.set('_life', game.localPlayer.get('_life') + nbLife);
                    } else {
                        game.localPlayer.set('_life', 100);
                    }
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
            if (other_object.name === 'cameraCollider') {
                var nbAmmo = Math.floor((Math.random() * 10) + 50);
                if (game.localPlayer.get('_ammo') < 100) {
                    scene.remove(this);
                    if (game.localPlayer.get('_ammo') < (100 - nbAmmo)) {
                        game.localPlayer.set('_ammo', game.localPlayer.get('_ammo') + nbAmmo);
                    } else {
                        game.localPlayer.set('_ammo', 100);
                    }
                }
            }
        });

    } else if (type === "energy") {
        mesh = new Physijs.BoxMesh(cube,
            new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture('javascripts/Maps/energy.jpg')
            }),
            0);
        mesh.name = "toHighlight";
        mesh.position = position;

        mesh.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            var nbEnergy = 20;
            console.log("colision energy");
            if (other_object.name === 'cameraCollider') {
                if (game.localPlayer.get('_energy') < 100) {
                    scene.remove(this);
                    if (game.localPlayer.get('_energy') < (100 - nbEnergy)) {
                        game.localPlayer.set('_energy', game.localPlayer.get('_energy') + nbEnergy);
                    } else {
                        game.localPlayer.set('_energy', 100);
                    }
                }

                if (game.localPlayer.get('_energy') >= 100) {
                    console.log()
                    map.progressShip();
                }


                console.log("nb energy " + game.localPlayer.get('_energy'));
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

/**
 * Fonction de mise a jour
 * @return {nothing}
 */
Map.prototype.update = function () {
    var map = this;
    if (typeof map.particleSystem !== 'undefined') {
        map.particleSystem.rotation.y += 0.0002;
    }
    if (map.currentLevel === 'ship') {
        map.robot_mechant.update();

    }


}


// pour faire tirer les robots
setInterval(function () {
    if (typeof window.game !== 'undefined' && typeof window.game.map !== 'undefined') {


        var i = window.game.map.robot_mechant.enemy.length;
        while (i--) {
            var distance = game.map.robot_mechant.enemy[i].robotCollider.position.distanceTo(window.cameraCollider.position);

            if (distance <= 300) {
                //console.log(game.map.robot_mechant.enemy[i].robotCollider.id + " " + distance);
                game.map.robot_mechant.shoot(game.map.robot_mechant.enemy[i].robotCollider, window.cameraCollider);

                //faire tourner le robot
                // game.map.robot_mechant.enemy[i].robotCollider.rotation.y = -window.cameraCollider_rotation.y;


            }
        }
    }

}, 1000);



if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Map;
else
    window.Map = Map;
