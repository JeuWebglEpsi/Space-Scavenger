var Bullet = function () {
    var bullet = this;
    this.name = 'bullet';
}


/*


A deplacer dans ennemy manage,
Quand les ennemies meurent, il looteront soit des munition soit de la vie

*/
Bullet.prototype.createAmmo = function(position) {

    var cube_ammo = new THREE.CubeGeometry(3, 3, 5);
    var ammo = new Physijs.BoxMesh(cube_ammo,
                            new THREE.MeshLambertMaterial({
                                map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')
                            }),
                            0);
    ammo.position = position;
    ammo.position.y += 1;



    ammo.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
        var nbAmmo = Math.floor((Math.random()*10)+1);
        console.log(nbAmmo);
        if (game.localPlayer.get('_ammo')  < 100) {
            scene.remove(this);
            if (game.localPlayer.get('_ammo') < (100 - nbAmmo)) {
                game.localPlayer.set('_ammo',game.localPlayer.get('_ammo') + nbAmmo);
            }
            else {
                game.localPlayer.set('_ammo',100);
            }
        }
    });


    scene.add(ammo);
}

/*


A deplacer dans ennemy manage,
Quand les ennemies meurent, il looteront soit des munition soit de la vie

*/
Bullet.prototype.createLife = function(position) {

    var cube_life = new THREE.CubeGeometry(3, 3, 5);
    var life = new Physijs.BoxMesh(cube_life,
                            new THREE.MeshLambertMaterial({
                                map: THREE.ImageUtils.loadTexture('javascripts/Maps/shiphull.jpg')
                            }),
                            0);
    life.position = position;
    life.position.y += 1;



    life.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
        var nbLife = Math.floor((Math.random()*100)+30);
        console.log(nbLife);
        if (game.localPlayer.get('_life')  < 100) {
            scene.remove(this);
            if (game.localPlayer.get('_life') < (100 - nbLife)) {
                game.localPlayer.set('_life',game.localPlayer.get('_life') + nbLife);
            }
            else {
                game.localPlayer.set('_life',100);
            }
        }
    });


    scene.add(life);
}

Bullet.prototype.position = function (position, camera){
        
        if (this.hasMunition()) {
            game.localPlayer.set('_ammo',game.localPlayer.get('_ammo')-1);
            var balle = new Physijs.BoxMesh(
                new THREE.SphereGeometry(5),
                new THREE.MeshBasicMaterial({ color: 0x888888 },0)
            );

            balle.name="bullet";
            balle.position.x = position.x;
            balle.position.y = position.y;
            balle.position.z = position.z;


            balle.movementSpeed = 100000000;
            balle.setLinearVelocity({
                x: balle.movementSpeed * 0,
                y: balle.movementSpeed * 0,
                z: balle.movementSpeed * 0
            });


         
            // balle.ray = new THREE.Ray(
            //         new THREE.Vector3({  x: position.x,
            //                              y: position.y, 
            //                              z: position.z }),
            //        balle.position.sub(camera.lookAt).normalize()               
            // );




           //console.log((camera.lookAt));
        // proj = new THREE.Projector();
        // proj.projectVector(position, camera);
        // var vector = new THREE.Vector3(mouseX, mouseY, 1);
        // balle.ray = new THREE.Ray(
        //                         camera.position,
        //                         position.sub(camera.position).normalize()
        //         );
        // balle.applyCentralImpulse(10);

    //position.applyMatrix4( balle.matrixWorld );

        balle.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                // console.log('asteroid ' + this.id + ' in collision with ' + other_object.id + ' ' + other_object.name);
            //console.log("balle touche");
            scene.remove(this);
        });
        
            scene.add(balle);
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
