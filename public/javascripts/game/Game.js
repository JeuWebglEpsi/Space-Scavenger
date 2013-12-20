    var Game = function () {
        var game = this;
        game.biome = new Biome();
        game.map = new Map();

    }
    //creation de personnage en fonction du type.
    Game.prototype.createPlayer = function (s) {
        var game = this;
        if (s === 'local') {
            var p = new Player(window.socketId, 'player', 100, 'feu', 'player');
            game.localPlayer = p;
            p.set('_life', 100);
            game.biome.personnages.push({
                player: p,
                type: 'player'
            });
            game.localPlayer.init(window.scene);
            console.log(game.biome.personnages);
        }
    }
    Game.prototype.YouWin = function () {
        $('#youwin').show();
        setTimeout(function () {
            $('#youwin').hide();
            window.toMainMenu(2);
        }, 4000);
    }
    Game.prototype.GameOver = function () {
        $('#gameover').show();
        setTimeout(function () {
            $('#gameover').hide();
            window.toMainMenu();
        }, 4000)
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
