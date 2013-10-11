//Class pour gérer le biome de personnage.


var Biome = function () {
	var biome = this;
	this.personnages = [];
}

//trouver un perso dans le biome
Biome.prototype.findInBiome = function (idItemInBiome) {
	var biome = this;
	biome.personnages.forEach(function (item, iterator) {
		if (idItemInBiome === item._id) {
			return {
				indice: iterator,
				item: irem
			};
		}
	})
	return;
}

//ajouter un perso au biome
Biome.prototype.addInBiome = function (personnage) {
	var biome = this;
	biome.personnages.push(personnage);
}

//supprimer un perso dans le biome
Biome.prototype.delInBiome = function (idItemInBiome) {
	var biome = this;
	var toDelete = this.findInBiome(idItemInBiome);
	if (toDelete) {
		biome.personnages.splice(toDelete.indice, 1);
		return true;
	}
	return;
}


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
	module.exports = Biome;
else
	window.Biome = Biome;
