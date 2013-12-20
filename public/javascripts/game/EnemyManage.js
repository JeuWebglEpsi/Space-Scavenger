var EnemyManage = function () {
    var EnemyManage = this;
    this.personnages = [];
    this.perso = new Personnage();
}

EnemyManage.prototype.createEnemy = function (x, y, z) { 
    var EnemyManage = this;
    var loader = new THREE.JSONLoader();
    loader.load("/javascripts/Objects/robot.js", function (geometry, materials) {
                        var mechant = new Physijs.BoxMesh(geometry, new THREE.MeshLambertMaterial(materials), 0);
                        mechant.name = "mechant_robot";
                        mechant.__dirtyposition = true;
                        mechant.__dirtyrotation = true;
                        mechant.position.x = x;
                        mechant.position.y = y;
                        mechant.position.z = z;

                        mechant.scale.x = mechant.scale.y = mechant.scale.z = 15;

                        mechant.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                //                     console.log('robot ' + this. id + ' in collision with ' + other_object.id + ' ' + other_object.name);
                            if (other_object.name === "bullet") {
                                var munition = new Bullet();

                                //munition.createLife(this.position);

                               scene.remove(this);

                            }

                        });

                        scene.add(mechant);
                    });

}
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