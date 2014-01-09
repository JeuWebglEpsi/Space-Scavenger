/**
 * Classe de gestion des énemis
 */
var EnemyManage = function () {
    var EnemyManage = this;
    this.personnages = [];
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
        var mechant = new Physijs.BoxMesh(geometry, new THREE.MeshLambertMaterial(materials), 0);
    
        mechant.name = "mechant_robot";
        mechant.__dirtyposition = true;
        mechant.__dirtyrotation = true;
        mechant.position.x = 0;
        mechant.position.y = 0;
        mechant.position.z = 0;



        mechant.scale.x = mechant.scale.y = mechant.scale.z = 15;

        mechant.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            console.log('robot ' + this. id + ' in collision with ' + other_object.id + ' ' + other_object.name);
            // si le robot collisionne avec une balle
            if (other_object.name === "bullet") {
  

                    scene.remove(this);
                    // chance de loot

               
            }
        });

        var robotCollider = new Physijs.SphereMesh(
            new THREE.CylinderGeometry(.4, .4, 6),
            new THREE.MeshBasicMaterial({
                color: 0x888888
            })
        );
        robotCollider.position.x = x;
        robotCollider.position.y = y+5;
        robotCollider.position.z = z;

        robotCollider.__dirtyposition = true;
        robotCollider.__dirtyrotation = true;
        robotCollider.name = "robotCollider";
        robotCollider.addEventListener('collision', function (obj) {
            //window.game.localPlayer.set('_life', window.game.localPlayer.get('_life') - 20);
            console.log('colliding with ' + obj.name + ' ' + obj.id + ' on ' + JSON.stringify(this.position));
        }); 
        robotCollider.rotation.set(0, 0, 0);
        //robotCollider.add(mechant);
        scene.add(mechant);
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
        mechant.position.x = x;
        mechant.position.y = y;
        mechant.position.z = z;

        mechant.scale.x = mechant.scale.y = mechant.scale.z = 20;

        mechant.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            // console.log('robot ' + this. id + ' in collision with ' + other_object.id + ' ' + other_object.name);
            if (other_object.name === "bullet") {
                var munition = new Bullet();

                //munition.createLife(this.position);

               scene.remove(this);

            }

        });

        scene.add(mechant);
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
    var perso = new Personnage();
    perso.init(x, y, z);
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
