var Bullet = function () {
    var bullet = this;
    this.name = 'bullet';
}

Bullet.prototype.position = function (position, camera){
        
        if (this.hasMunition()) {
            game.localPlayer.set('_ammo',game.localPlayer.get('_ammo')-1);
            var sphere = new Physijs.ConvexMesh(
                new THREE.SphereGeometry(3),
                new THREE.MeshBasicMaterial({ color: 0x888888 },10000000)
            );
            sphere.scale.x = sphere.scale.y = sphere.scale.z = 0.1;

            sphere.name="bullet";
            sphere.position.x = position.x;
            sphere.position.y = position.y;
            sphere.position.z = position.z;

            console.log(sphere);


        var mouseX = (event.clientX / window.innerWidth)*2-1;
        var mouseY = -(event.clientY /window.innerHeight)*2+1;

        // proj = new THREE.Projector();
        // proj.projectVector(position, camera);
        // var vector = new THREE.Vector3(mouseX, mouseY, 1);
        // sphere.ray = new THREE.Ray(
        //                         camera.position,
        //                         position.sub(camera.position).normalize()
        //         );
        // sphere.applyCentralImpulse(10);

position.applyMatrix4( sphere.matrixWorld );
        sphere.setLinearVelocity({x:100, y:0, z:0});
            scene.add(sphere);
        }

    }

    Bullet.prototype.hasMunition= function () {

        if( game.localPlayer.get('_ammo') > 0) {
            return true;  
        }
        else {
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
