/**
 *	Classe pour la création des murs
 */
 var Wall = function () {
 	var wall = this;
 	this.name = '';
 	this.life = 0;
 }

Wall.prototype.init = function(name) {
	this.name = name;
	if (name === 'wall'){

	} else if(name === 'wall_breakable'){
	} else if(name === 'locked_door'){
	} else if(name === 'door'){
	} else if(name === 'wall_scratched'){
	} 
};

Wall.prototype.shooted = function(object) {
	if(object.name === 'wall_breakable') {
		this.life--;
		if(this.life === 0) {
			window.scene.remove(this);
		}

	}
}




if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Wall;
else
    window.Biome = Wall;