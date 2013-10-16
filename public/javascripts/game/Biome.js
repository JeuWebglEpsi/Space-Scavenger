//Class pour gérer le biome de personnage.
//le biome gere toute la couche mobile et vivante du jeu
//ceci comprends les joueurs et les enemis.
(function () {
	'use strict';
	var Biome = function () {
		var biome = this;
		this.personnages = [];
	}

	//trouver un perso dans le biome
	Biome.prototype.findInBiome = function (idItemInBiome) {
		var biome = this;
		var indice = null;
		for (var i = 0, nb = biome.personnages.length; i < nb; i++) {
			if (biome.personnages[i]._socketId === idItemInBiome) {
				indice = i;
				break;
			}
		}
		return indice;
	}

	//ajouter un perso au biome
	Biome.prototype.addInBiome = function (personnage) {
		var biome = this;
		core.socket.emit('registerPlayer', personnage);
		biome.personnages.push({
			id: personnage._socketId,
			personnage: personnage
		});
	}

	//supprimer un perso dans le biome
	Biome.prototype.delInBiome = function (idItemInBiome) {
		var biome = this;
		var toDelete = this.findInBiome(idItemInBiome);
		if (toDelete) {
			biome.personnages.splice(toDelete, 1);
			return true;
		}
		return;
	}

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
		module.exports = Biome;
	else
		window.Biome = Biome;
})()
