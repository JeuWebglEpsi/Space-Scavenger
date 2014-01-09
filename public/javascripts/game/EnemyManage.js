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
 * @param  {number} x
 * @param  {number} y
 * @param  {number} z
 * @return {[nothing]}
 */
EnemyManage.prototype.createEnemy = function (x, y, z) {
    var EnemyManage = this;
    var cameraRobot = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
     var cameraViewProjectionMatrix = new THREE.Matrix4();
     var frustum = new THREE.Frustum();

    //var map = ship_map
    //console.log("map is : " + map);
    //var plane = new THREE.PlaneGeometry()
    //camera.updateMatrix(); // make sure camera's local matrix is updated
//camera.updateMatrixWorld(); // make sure camera's world matrix is updated
//camera.matrixWorldInverse.getInverse( camera.matrixWorld );
//plane.updateMatrix(); // make sure plane's local matrix is updated
//plane.updateMatrixWorld(); // make sure plane's world matrix is updated

    cameraRobot.updateMatrixWorld() // = window.camera.updateMatrixWorld();
    cameraRobot.matrixWorldInverse.getInverse(cameraRobot.matrixWorld);
    cameraViewProjectionMatrix.multiplyMatrices(cameraRobot.projectionMatrix, cameraRobot.matrixWorldInverse);
    frustum.setFromMatrix(cameraViewProjectionMatrix);

//frustum.setFromMatrix(map);
//frustum.setFromMatrix( new THREE.Matrix4().multiply( camera.projectionMatrix, camera.matrixWorldInverse ) );
//alert( frustum.contains( plane ) );


    var loader = new THREE.JSONLoader();
    loader.load("/javascripts/Objects/robot.js", function (geometry, materials) {
        var mechant = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial(materials), 0);

    
        mechant.name = "mechant_robot";
        mechant.__dirtyposition = true;
        mechant.__dirtyrotation = true;

        mechant.scale.x = mechant.scale.y = mechant.scale.z = 15;

 var cube = new THREE.CylinderGeometry(20, 20, 90);

    var robotCollider = new Physijs.BoxMesh(cube,
            new THREE.MeshBasicMaterial({
                color: 0x888888,
                transparent: true,
                opacity: 0
            }),0
            );
    robotCollider.life = 5;

        robotCollider.position.x = x;
        robotCollider.position.y = y;
        robotCollider.position.z = z;

        robotCollider.__dirtyposition = true;
        robotCollider.__dirtyrotation = true;
        robotCollider.name = "robotCollider";
        robotCollider.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            //window.game.localPlayer.set('_life', window.game.localPlayer.get('_life') - 20);
            console.log('robotCollider colliding with ' + other_object.name + ' ' + other_object.id + ' on ' + JSON.stringify(this.position));
            if (other_object.name === "bullet"){
                this.life--;
                if (this.life === 0) {
                var luck = Math.floor((Math.random() * 100));
                if (luck > 60)
                    window.game.map.createLoot(other_object, "ammo");
                else if (luck > 30)
                    window.game.map.createLoot(other_object, "life");


                scene.remove(this);
            }
            }

        }); 

        robotCollider.rotation.set(0, 0, 0);
        robotCollider.add(mechant);
        scene.add(robotCollider);
    });
}

/**
 * Fonction de création
 * @param  {number} x
 * @param  {number} y
 * @param  {number} z
 * @return {[nothing]}
 */
EnemyManage.prototype.createSuperEnemy = function (x, y, z) { 
    var EnemyManage = this;
    var loader = new THREE.JSONLoader();
    loader.load("/javascripts/Objects/robot.js", function (geometry, materials) {
        var mechant = new Physijs.BoxMesh(geometry, new THREE.MeshLambertMaterial(materials), 0);
        mechant.name = "super_mechant_robot";
        mechant.__dirtyposition = true;
        mechant.__dirtyrotation = true;

        mechant.scale.x = mechant.scale.y = mechant.scale.z = 20;
        var cube = new THREE.CylinderGeometry(30, 30, 120);
        var robotCollider = new Physijs.BoxMesh(cube,
                new THREE.MeshBasicMaterial({
                    color: 0x888888,
                    transparent: true,
                    opacity: 0
                }),0
                );
        robotCollider.life = 20;

            robotCollider.position.x = x;
            robotCollider.position.y = y;
            robotCollider.position.z = z;

            robotCollider.__dirtyposition = true;
            robotCollider.__dirtyrotation = true;
            robotCollider.name = "robotCollider";
            robotCollider.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                //window.game.localPlayer.set('_life', window.game.localPlayer.get('_life') - 20);
                console.log('robotCollider colliding with ' + other_object.name + ' ' + other_object.id + ' on ' + JSON.stringify(this.position));
                if (other_object.name === "bullet"){
                    this.life--;
                    console.log(this.life);
                    if (this.life === 0) {
                    var luck = Math.floor((Math.random() * 100));
                    if (luck > 60)
                        window.game.map.createLoot(other_object, "ammo");
                    if (luck > 30)
                        window.game.map.createLoot(other_object, "life");


                    scene.remove(this);
                }
                }

            }); 

        robotCollider.rotation.set(0, 0, 0);
        robotCollider.add(mechant);

        scene.add(robotCollider);
    });

}


/**
 * Fonction d'initialisation
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @param  {[type]} z [description]
 * @return {[type]}   [description]
 */
EnemyManage.prototype.init = function (x, y, z) {
    // lesméchants
    // robotCount permet de créer un nombre de robot enemycount permet de leur donner un id
    //var robotCount =10;
    //var enemyCount = 0;
    // while (robotCount--){
  //  var perso = new Personnage();
   // perso.init(x, y, z);
    /*   enemyManage.personnages[enemyCount] = perso.id;
             enemyCount++;
             console.log ('Nombre de perso = ' + enemyCount);
             console.log('identifiant du dernier perso = ' + perso.id);
        }*/

}
//setangulareVellocity
//__dirtyrotation
//__dirtyposition
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = EnemyManage;
else
    window.EnemyManage = EnemyManage;
