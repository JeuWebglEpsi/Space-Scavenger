    var Game = function () {
        var game = this;
        game.socket = io.connect('http://' + location.host);
        game.biome = new Biome();
        game.map = new Map();
    }
    //creation de personnage en fonction du type.
    Game.prototype.createPlayer = function (s) {
        var game = this;
        if (s === 'local') {
            var nom = prompt("Saisisez votre nom");
            if (nom != null) {
                var p = new Player(window.socketId, nom, 100, 'feu', 'player');
                game.socket.emit('registerPlayer', p);
                game.localPlayer = p;
                p.set('_life', 100);
                game.biome.personnages.push({
                    id: window.socketId,
                    player: p,
                    type: 'player'
                });
                game.localPlayer.init(window.scene);
            }
        }
    }

    //Game updating function
    Game.prototype.update = function () {
        var game = this;
        //     console.log('Game updating...');
        game.biome.update();
        game.map.update();
    }

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = Game;
    else
        window.Game = Game;
