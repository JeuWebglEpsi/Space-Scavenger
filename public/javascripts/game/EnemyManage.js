/**
 * Classe de gestion des énemis
 */
var EnemyManage = function () {
    var EnemyManage = this;
    this.enemy = [];
    this.perso = new Personnage();
}

/**
 * Fonction de création
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {[nothing]}
 */
EnemyManage.prototype.createEnemy = function (x, y, z, mechantCount) {
    var EnemyManage = this;
    var cameraRobot = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    var cameraViewProjectionMatrix = new THREE.Matrix4();
    var frustum = new THREE.Frustum();

    cameraRobot.updateMatrixWorld() // = window.camera.updateMatrixWorld();
    cameraRobot.matrixWorldInverse.getInverse(cameraRobot.matrixWorld);
    cameraViewProjectionMatrix.multiplyMatrices(cameraRobot.projectionMatrix, cameraRobot.matrixWorldInverse);
    frustum.setFromMatrix(cameraViewProjectionMatrix);
 /*var mater = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('javascripts/Objects/robot.png')
        });*/
    var loader = new THREE.JSONLoader();
    loader.load("/javascripts/Objects/robot.js", function (geometry, materials) {

        var mechant = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial(materials),0);
        mechant.position.y = -40;

        mechant.id_robot = mechantCount;
        mechant.name = "mechant_robot";

        // EnemyManage.addInEnemy(mechant);

        mechant.scale.x = mechant.scale.y = mechant.scale.z = 15;
        cameraRobot.rotation.set(0, 0, 0);

        mechant.add(cameraRobot);

        var cube = new THREE.CylinderGeometry(30, 30, 40);
        var robotCollider = new Physijs.BoxMesh(cube,
            new THREE.MeshBasicMaterial({
                color: 0x888888,
                wireframe: true,
                transparent: true,
                opacity: 0
            }), 0
        );
        robotCollider.name = "robotCollider";
        robotCollider.__dirtyPosition = true;
        robotCollider.__dirtyRotation = true;

        robotCollider.moveXplus = true;
        robotCollider.moveXmoins = false;
        robotCollider.moveZplus = false;
        robotCollider.moveZmoins = false;

        var vector = new THREE.Vector3(0, 0, -1);
        var pw = vector.applyMatrix4(robotCollider.matrixWorld);
        var dir = pw.sub(robotCollider.position).normalize();

        robotCollider.life = 5;
        robotCollider.id_robot = mechantCount;
        robotCollider.position.x = x;
        robotCollider.position.y = 30;
        robotCollider.position.z = z;
        robotCollider.movementSpeed = 1000;

        robotCollider.rotation.set(0, 0, 0);
        robotCollider.name = "robotCollider";
        robotCollider.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            //window.game.localPlayer.set('_life', window.game.localPlayer.get('_life') - 20);
            //  console.log('robotCollider colliding with ' + other_object.name + ' ' + other_object.id + ' on ' + JSON.stringify(this.position));
            if (other_object.name === "bullet") {
                this.life--;
                //   console.log(this.life);
                if (this.life === 0) {
                    var luck = Math.floor((Math.random() * 100));
                    if (luck > 60)
                        window.game.map.createLoot(other_object, "ammo");
                    else if (luck > 30)
                        window.game.map.createLoot(other_object, "life");

                    // suppression du tableau enemy
                    var i = EnemyManage.enemy.length;
                    while (i--) {
                        if (EnemyManage.enemy[i].robotCollider.id === this.id) {
                            EnemyManage.enemy.splice(i, 1);
                            i = 0;
                        }
                    }

                    scene.remove(this);
                }
            }
            if (other_object.name === "wall" || other_object.name === 'Door' || other_object.name === 'LockedDoor' || other_object.name === 'wall_breakable') {
                this.__dirtyPosition = true;
                if (this.moveXplus) {
                    this.position.x -= 0.5;
                    this.moveXplus = false;
                    this.moveZplus = true;
                } else if (this.moveZplus) {
                    this.position.z -= 0.5;
                    this.moveZplus = false;
                    this.moveXmoins = true;
                } else if (this.moveXmoins) {
                    this.position.x += 0.5;
                    this.moveXmoins = false;
                    this.moveZmoins = true;
                } else if (this.moveZmoins) {
                    this.position.z += 0.5;
                    this.moveZmoins = false;
                    this.moveXplus = true;
                }
                // console.log("robot percute wall");
            }


        });

        // var cube_detect = new THREE.SphereGeometry(300);

        // var robotDetector = new THREE.Mesh(cube_detect,
        // new THREE.MeshBasicMaterial({
        // color: 0x888888,
        // transparent: true,
        // opacity: 0.5
        // }), 0
        // );
        // robotDetector.rotation.set(0, 0, 0);
        // robotDetector.__dirtyposition = true;
        // robotDetector.__dirtyrotation = true;
        // robotDetector.name = "robotDetector";
        // robotDetector.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
        // //window.game.localPlayer.set('_life', window.game.localPlayer.get('_life') - 20);
        // console.log('robotDetector colliding with ' + other_object.name + ' ' + other_object.id + ' on ' + JSON.stringify(this.position));
        // if (other_object.name === "cameraCollider") {
        // console.log('robotDetector colliding with ' + other_object.name + ' ' + other_object.id + ' on ' + JSON.stringify(this.position));

        // }

        // });

        // robotCollider.add(robotDetector);
        mechant.rotation.set(0, 0, 0);
        robotCollider.mechant = mechant;

        robotCollider.add(mechant);

        // robotCollider.updateMatrixWorld();
        EnemyManage.addInEnemy(robotCollider);
        scene.add(robotCollider);
        robotCollider.setLinearVelocity({
            x: robotCollider.movementSpeed * dir.x,
            y: robotCollider.movementSpeed * dir.y,
            z: robotCollider.movementSpeed * dir.z
        });
    });
}

/**
 * Fonction de création
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {[nothing]}
 */

EnemyManage.prototype.createSuperEnemy = function (x, y, z, mechantCount) {
    var EnemyManage = this;
    var loader = new THREE.JSONLoader();
    loader.load("/javascripts/Objects/robot.js", function (geometry, materials) {
        var mechant = new Physijs.BoxMesh(geometry, new THREE.MeshLambertMaterial(materials), 0);
        mechant.id_robot = mechantCount;
        mechant.name = "super_mechant_robot";
        mechant.__dirtyposition = true;
        mechant.__dirtyrotation = true;
        // EnemyManage.addInEnemy(mechant);

        mechant.scale.x = mechant.scale.y = mechant.scale.z = 20;
        var cube = new THREE.CylinderGeometry(30, 30, 120);
        var robotCollider = new Physijs.BoxMesh(cube,
            new THREE.MeshBasicMaterial({
                color: 0x888888,
                transparent: true,
                opacity: 0
            }), 0
        );
        robotCollider.life = 20;
        robotCollider.id_robot = mechantCount;
        robotCollider.position.x = x;
        robotCollider.position.y = y;
        robotCollider.position.z = z;

        robotCollider.__dirtyPosition = true;
        robotCollider.__dirtyRotation = true;
        robotCollider.name = "robotCollider";
        robotCollider.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {



            //window.game.localPlayer.set('_life', window.game.localPlayer.get('_life') - 20);
            //     console.log('robotCollider colliding with ' + other_object.name + ' ' + other_object.id + ' on ' + JSON.stringify(this.position));
            if (other_object.name === "bullet") {
                this.life--;
                //      console.log(this.life);
                if (this.life === 0) {
                    var luck = Math.floor((Math.random() * 100));
                    if (luck > 60)
                        window.game.map.createLoot(other_object, "ammo");
                    if (luck > 30)
                        window.game.map.createLoot(other_object, "life");
                    //console.log("test remove id="+this.id);

                    var i = EnemyManage.enemy.length;
                    while (i--) {
                        if (EnemyManage.enemy[i].robotCollider.id === this.id) {
                            EnemyManage.enemy.splice(i, 1);
                            i = 0;
                        }
                    }

                    scene.remove(this);
                }
            }
            if (other_object.name === "wall" || other_object.name === 'Door' || other_object.name === 'LockedDoor' || other_object.name === 'wall_breakable') {
                var newx = x - 0.5;
                robotCollider.position.x = x;
                var robotRotation = enemyManage.robotTurn();
                // robotCollider.
                //    console.log("robot percute wall");
            }

        });

        robotCollider.rotation.set(0, 0, 0);
        robotCollider.add(mechant);
        EnemyManage.addInEnemy(robotCollider);
        scene.add(robotCollider);
    });

}

EnemyManage.prototype.addInEnemy = function (robotCollider) {
    EnemyManage = this;
    EnemyManage.enemy.push({
        id: robotCollider.id,
        robotCollider: robotCollider
    });
};

EnemyManage.prototype.shoot = function (robotCollider, cameraCollider) {
    robotCollider.shooting = true;
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
    // balle.__dirtyRotation = true;

    var vector = new THREE.Vector3(0, 0, -1);
    var pw = vector.applyMatrix4(cameraCollider.matrixWorld);
    var dir = pw.sub(cameraCollider.position).normalize();

    balle.name = 'mechant_bullet';


    balle.position.x = robotCollider.position.x + (50 * -dir.x) + robotCollider.scale.x * -dir.x;
    balle.position.y = robotCollider.position.y;
    balle.position.z = robotCollider.position.z + (50 * -dir.z) + robotCollider.scale.z * -dir.z;

    balle.movementSpeed = 1000;


    balle.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
        //console.log('mechant bullet ' + this.id + ' in collision with ' + other_object.id + ' ' + other_object.name);
        if (other_object.name === "cameraCollider")
            window.game.localPlayer.set("_life", window.game.localPlayer.get('_life') - 10);

        if (other_object.name !== "robotCollider")
            scene.remove(this);

    });
    //console.log("create balle mechant");

    scene.add(balle);
    balle.setLinearVelocity({
        x: balle.movementSpeed * -dir.x,
        y: balle.movementSpeed * -dir.y,
        z: balle.movementSpeed * -dir.z
    });

    robotCollider.shooting = false;

};

EnemyManage.prototype.init = function (x, y, z) {

}

EnemyManage.prototype.update = function () {
    window.scene.traverse(function (obj) {
        if (obj.name === 'robotCollider') {
            if (!obj.shooting) {
                obj.__dirtyPosition = true;
                if (obj.moveXplus) obj.position.x += 1;
                if (obj.moveZplus) obj.position.z += 1;
                if (obj.moveXmoins) obj.position.x -= 1;
                if (obj.moveZmoins) obj.position.z -= 1;
            }
           /* var vector = new THREE.Vector3(0, 0, -1);
            vector.applyQuaternion(obj.mechant.cameraRobot.quaternion);
            var angle = vector.angleTo(window.cameraCollider.position);
            obj.setRotationFromAxisAngle(obj.position.y, angle);*/
            //EnemyManage.superRotation(obj);
            }
    })
}
EnemyManage.prototype.superRotation = function (obj){
//var direction = new THREE.Vector3().subVectors(obj.position, cameraCollider.position);
//obj.rotation.set(0, direction.y, 0);
//on récupère les positions 
var p = window.cameraCollider.position; 
var r = obj.position; 
var rot = obj.rotation;
var look = obj.mechant.cameraRobot.LookAt();
console.log("look at " + look.y)
console.log("position robot : " + r.x + " " + r.y+ " " + r.z);
console.log("position player : " + p.y + " " + p.y+ " " + p.z);
console.log ("rotation du robot : " + rot.y);
// norme
var x1 = p.x -r.x;
var x2 = x1 * x1;
var z1 = p.z - r.z;
var z2 = z1 * z1;
var norme = Math.sqrt(x2 + z2);
console.log(" x1 " + x1);
console.log(" x2 " + x2);
console.log(" z1 " + z1);
console.log(" z2 " + z2);
console.log(" norme : " + norme);

//calcul angle
var cosDegretB = z1 / norme;
//convertion en radian
var degretToRadian = Math.PI /180;
var cosB = cosDegretB * degretToRadian;
var B = 0;
if (p.x > r.x){
    B = Math.acos(cosB)
}
else if (p.x < r.x){
    B -= Math.acos(cosB);
}
//on enleve l'angle initiale du robot par rapport à au repère
var G = B - rot.y;
console.log(" l'angle B : " + B + " ... G : " + G);
obj.rotation.set(0, G, 0);
}


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = EnemyManage;
else
    window.EnemyManage = EnemyManage;
