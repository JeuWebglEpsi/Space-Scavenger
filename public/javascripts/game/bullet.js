/**
 * Classe de balle
 */
var Bullet = function () {
    var bullet = this;
    this.name = 'bullet';
    this.soundbullet = new Howl({
        urls: ['laser.ogg'],
        sprite: {
            laser: [100, 1000]
        }
    })
}
/**
 * Fonctio nde création balle
 * @param  {Mesh} cameraCollider Point de départ de la balle
 * @param  {[Camera]} camera         Caméra du joueur
 * @return {nothing}
 */
Bullet.prototype.position = function (cameraCollider, camera) {
    var b = this;
    var loader = new THREE.JSONLoader();

    if (this.hasMunition()) {
        game.localPlayer.set('_ammo', game.localPlayer.get('_ammo') - 1);
        var bulletCamera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1e7);
        var balle = new Physijs.BoxMesh(new THREE.SphereGeometry(1),
            new THREE.ShaderMaterial({
                uniforms: {
                    color: 0xFF0000
                },
                vertexShader: document.getElementById('vertexShaderBullet').textContent,
                fragmentShader: document.getElementById('fragmentShaderBullet').textContent,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending,
                transparent: true
            }), 1
        );
        balle.add(bulletCamera);
        balle.__dirtyPosition = true;

        var vector = new THREE.Vector3(0, 0, -1);
        var pw = vector.applyMatrix4(cameraCollider.matrixWorld);
        var dir = pw.sub(cameraCollider.position).normalize();

        balle.name = 'bullet';
        balle.position.x = cameraCollider.position.x + (1.20 * dir.x) + cameraCollider.scale.x * dir.x;
        balle.position.y = cameraCollider.position.y + (1.20 * dir.y) + cameraCollider.scale.y * dir.y;
        balle.position.z = cameraCollider.position.z + (1.20 * dir.z) + cameraCollider.scale.z * dir.z;


        balle.movementSpeed = 2500;

        balle.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            // console.log('asteroid ' + this.id + ' in collision with ' + other_object.id + ' ' + other_object.name);
            if (other_object.name !== "cameraCollider")
                scene.remove(this);



            if (other_object.name === "asteroid") {
                scene.remove(other_object);
                var popItem = parseInt(Math.random() * 10);
                if (popItem > 5) {
                    var item = parseInt(Math.random() * 10);
                    if (item > 5) {
                        window.game.map.createLoot(other_object, 'life')
                    } else {
                        window.game.map.createLoot(other_object, 'ammo');
                    }
                } else {
                    window.game.map.createLoot(other_object, 'levier');
                }
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

        b.soundbullet.play('laser');

        balle.setLinearVelocity({
            x: balle.movementSpeed * dir.x,
            y: balle.movementSpeed * dir.y,
            z: balle.movementSpeed * dir.z
        });
    }

}

Bullet.prototype.hasMunition = function () {

    if (window.game.localPlayer.get('_ammo') > 0) {
        return true;
    } else {
        return false;
    }

}

Bullet.prototype.create_ammobox = function (position) {

    console.log("ammobox sa passe");
    var loader = new THREE.JSONLoader();
    loader.load("/javascripts/Objects/ammobox.js", function (geometry, materials) {
        console.log("ammobox sa repasse");
        var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshFaceMaterial(materials), 0);
        mesh.name = "toHighlight";
        mesh.position = position;
        console.log(mesh.position);

        mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.5;

        mesh.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            console.log("ammobox collide");
            if (other_object.name === "cameraCollider") {
                window.game.localPlayer.set('_ammo', 100);
            }
        });
        scene.add(mesh);
    });
    // body...
};

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
