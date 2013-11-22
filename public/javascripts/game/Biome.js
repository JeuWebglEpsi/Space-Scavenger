var Biome = function () {
    var biome = this;
    this.personnages = [];
}

//trouver un perso dans le biome
Biome.prototype.findInBiome = function (idItemInBiome) {
    var biome = this;
    var it = biome.personnages.length - 1;
    while (it--) {
        if (idItemInBiome === this.personnages[i].get('_socketId')) {
            return it;
        }
    }
    return null;
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
//Biome updating function
Biome.prototype.update = function () {
    var biome = this;
    //  console.log('Biome updating...');
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Biome;
else
    window.Biome = Biome;
