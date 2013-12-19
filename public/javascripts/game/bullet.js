var Bullet = function () {
    var bullet = this;
    this.name = 'bullet';
}


/*


A deplacer dans ennemy manage,
Quand les ennemies meurent, il looteront soit des munition soit de la vie

*/
Bullet.prototype.createAmmo = function (position) {

    var cube_ammo = new THREE.CubeGeometry(3, 3, 5);
    var ammo = new Physijs.BoxMesh(cube_ammo,
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')
        }),
        0);
    ammo.position = position;
    ammo.position.y += 1;



    ammo.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
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


    scene.add(ammo);
}

/*


A deplacer dans ennemy manage,
Quand les ennemies meurent, il looteront soit des munition soit de la vie

*/
Bullet.prototype.createLife = function (position) {

    var cube_life = new THREE.CubeGeometry(3, 3, 5);
    var life = new Physijs.BoxMesh(cube_life,
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')
        }),
        0);
    life.position = position;
    life.position.y += 1;



    life.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
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


    scene.add(life);
}

Bullet.prototype.position = function (cameraCollider, camera) {
    var loader = new THREE.JSONLoader();

    if (this.hasMunition()) {
        game.localPlayer.set('_ammo', game.localPlayer.get('_ammo') - 1);
        var balle = new Physijs.BoxMesh(new THREE.SphereGeometry(2),
            new THREE.MeshBasicMaterial({
                color: 0x888888
            }), 1
        );
        balle.__dirtyPosition = true;
        var vector = new THREE.Vector3(0, 0, -1);
        var pw = vector.applyMatrix4(cameraCollider.matrixWorld);
        var dir = pw.sub(cameraCollider.position).normalize();

        balle.name = "bullet";
        balle.position.x = cameraCollider.position.x + 10;
        balle.position.y = cameraCollider.position.y;
        balle.position.z = cameraCollider.position.z + 10;


        balle.movementSpeed = 5000;


        balle.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            // console.log('asteroid ' + this.id + ' in collision with ' + other_object.id + ' ' + other_object.name);
            scene.remove(balle);
            if (other_object.name === "asteroid") {
                scene.remove(other_object);

                var scale = parseInt(other_object.scale.x);
                if (scale < 50) {

                    loader.load("/javascripts/Maps/asteroid.js", function (geometry, materials) {
                        var asteroidCount = 3;

                        var weight = scale;
                        while (asteroidCount--) {

                            var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshFaceMaterial(materials), 10000 * (weight / 3));
                            mesh.position.x = other_object.position.x;
                            mesh.position.y = other_object.position.y;
                            mesh.position.z = other_object.position.z;
                            mesh.rotation.x = Math.random();
                            mesh.rotation.y = Math.random();
                            mesh.rotation.z = Math.random();

                            mesh.receiveShadow = true;
                            mesh.castShadow = true;
                            mesh.scale.x = mesh.scale.y = mesh.scale.z = weight / 3;

                            mesh.name = "asteroid";
                            mesh.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                                // console.log('asteroid ' + this.id + ' in collision with ' + other_object.id + ' ' + other_object.name);
                            });
                            scene.add(mesh);
                        }
                    });



                }
            }
        });

        scene.add(balle);

        balle.setLinearVelocity({
            x: balle.movementSpeed * dir.x,
            y: balle.movementSpeed * dir.y,
            z: balle.movementSpeed * dir.z
        });
    }

}

Bullet.prototype.hasMunition = function () {

    if (game.localPlayer.get('_ammo') > 0) {
        return true;
    } else {
        return false;
    }

}

// a modifier
/*
        event.preventDefault();
        if (event.which === 1) { // Left click only

        var mouseX = (event.clientX / window.innerWidth)*2-1;
        var mouseY = -(event.clientY /window.innerHeight)*2+1;


            // var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x333333});
            // var sphereGeo = new THREE.SphereGeometry(2, 6, 6);
            // var sphere = new Physijs.BoxMesh(sphereGeo, sphereMaterial);


            var sphere = new Physijs.SphereMesh(
                new THREE.SphereGeometry(3),
                new THREE.MeshBasicMaterial({ color: 0x888888 },0)
            );
            sphere.scale.x = sphere.scale.y = sphere.scale.z = 0.1;

            sphere.name="bullet";




            var pLocal = new THREE.Vector3(mouseX, mouseY,0);

            var pWorld = pLocal.applyMatrix4(camera.matrixWorld );

            var dir = camera.position;

                //position du joueur
                var pos = new THREE.Vector3();
                pos.x = controls.getObject().position.x;
                pos.y = controls.getObject().position.y;
                pos.z = controls.getObject().position.z;

                console.log(pos);
                // var projector = new THREE.Projector();
                // var vector = camera.position;
                // projector.unprojectVector(dir, camera);
                sphere.ray = new THREE.Raycaster(
                                pos,
                                dir
                );


            sphere.owner = camera
            console.log(sphere);
            sphere.addEventListener('collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
            console.log('bullet ' + this.id + ' in collision with ' + other_object.id + ' ' + other_object.name);


        });
            window.scene.add(sphere);

        }*/
