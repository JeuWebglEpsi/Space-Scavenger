require(['jquery', 'three', 'physi'], function ($, THREE, Physijs) {
    console.log(arguments);
    Physijs.scripts.worker = '/javascripts/core/lib/physijs_worker.js';

    window.scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3(0, -30, 0));

    window.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000000);

    window.renderer = new THREE.WebGLRenderer({
        antialias: true,
        precision: 'highp'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);


    $('body').append(renderer.domElement);

    window.game = new Game();
    game.map.space();



    //sockets
    window.game.socket.on('connect', function () {
        window.socketId = this.socket.sessionid;
        console.log(window.socketId);
        window.game.createPlayer('local');
        window.render();
    });
    //evenement quand un nouveau joueur arrive
    window.game.socket.on('newPlayerJoin', function (player) {
        var exists = false;
        for (var i = 0, nb = window.game.biome.personnages.length; i < nb; i++) {
            if (window.game.biome.personnages[i]._socketId === player.id) {
                exists = true;
            }
        }
        if (!exists) {
            console.log('adding to biome');
            console.log(player);
            var p = player.player;
            var play = new Personnage(player.id, p._name, p._life, p._element, p._type);
            window.game.biome.personnages.push({
                id: player.id,
                player: play,
                type: 'player'
            });
        }
    })
    //quand un joueur se déconnecte
    window.game.socket.on('deletePlayer', function (player) {
        var exists = false;
        for (var i = 0, nb = window.game.biome.personnages.length; i < nb; i++) {
            if (window.game.biome.personnages[i]._socketId === player.id) {
                exists = i;
            }
        }
        if (exists) {
            console.log('deleting from biome');
            console.log(player);
            window.game.biome.personnages.splice(exists, 1);
            $('#' + player.id).remove();
            console.log(window.game.biome.personnages);
        }
    })
    //on met a jour la liste des joueur (visible a gauche)
    window.game.socket.on('updatePlayerList', function (players) {
        $('.playerlist').html('');
        players.forEach(function (player) {
            var p = player.player;
            $('.players .playerlist').append('<li id="' + p._socketId + '">' + p._name + '</li>');
        })
        /*TEST de draw quand un player arrive*/

        /*fin du test*/
    })



    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);

    hemiLight.position.set(0, 500, 0);
    scene.add(hemiLight);
    /*END MAYBE*/

    //GAME LOOP
    window.render = function () {

        //Game update loop
        game.update();

        //Game render loop
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };

})
