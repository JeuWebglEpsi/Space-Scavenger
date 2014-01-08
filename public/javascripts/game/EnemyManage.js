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
    //var EnemyManage = this;
    var loader = new THREE.JSONLoader();
    loader.load("/javascripts/Objects/robot.js", function (geometry, materials) {
        var mechant = new Physijs.BoxMesh(geometry, new THREE.MeshLambertMaterial(materials), 0);
        // Définition de la vie du robot
       

        mechant.name = "mechant_robot";
        mechant.__dirtyposition = true;
        mechant.__dirtyrotation = true;
        mechant.position.x = x;
        mechant.position.y = y;
        mechant.position.z = z;
        mechant.life = 5;

        mechant.scale.x = mechant.scale.y = mechant.scale.z = 15;

        mechant.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            console.log('robot ' + this. id + ' in collision with ' + other_object.id + ' ' + other_object.name);
            if (other_object.name === "bullet") {
               // console.log("Vie : "+this.life);
               this.life--;
               console.log("vie robot " + this.life);
               if (this.life === 0)
                    scene.remove(this);
            }
        });
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
