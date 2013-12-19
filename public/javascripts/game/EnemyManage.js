var EnemyManage = function () {
    var EnemyManage = this;
    this.personnages = [];
    this.perso = new Personnage();
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