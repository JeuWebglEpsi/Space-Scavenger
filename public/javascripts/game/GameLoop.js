require(['jquery', 'three', 'physi', 'pointerlockcontrols', 'resize', 'game'], function ($, THREE, Physijs, PointerLockControls, WindowResize, Game) {
    console.log(arguments);

    if ('webkitIsFullScreen' in document) {
        Document.prototype.cancelFullScreen = Document.prototype.webkitCancelFullScreen;
        HTMLElement.prototype.requestFullScreen = HTMLElement.prototype.webkitRequestFullScreen;
        document.__defineGetter__("isFullScreen", function () {
            return document.webkitIsFullScreen;
        });
        document.__defineGetter__("fullScreen", function () {
            return document.webkitIsFullScreen;
        });
    } else if ('mozFullScreen' in document) {
        Document.prototype.cancelFullScreen = document.mozCancelFullScreen;
        HTMLElement.prototype.requestFullScreen = HTMLElement.prototype.mozRequestFullScreen;
        document.__defineGetter__("isFullScreen", function () {
            return document.mozFullScreen;
        });
        document.__defineGetter__("fullScreen", function () {
            return document.mozFullScreen;
        });
    }

    window.isBlocked = true;
    //capture du pointeur.
    window.addEventListener('click', function () {
        var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;


        var element = document.body;
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();
        //element.requestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        $('#blocker').addClass('hidden')
    })


    //Initialisation du monde
    Physijs.scripts.worker = '/javascripts/core/lib/physijs_worker.js';
    window.scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3(0, -30, 0));

    var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1e7);

    var controls = new PointerLockControls(camera);
    controls.enabled = true;
    scene.add(controls.getObject());

    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        precision: 'highp'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);


    $('body').append(renderer.domElement);

    window.game = new Game();
    game.map.space();
    console.log(game.map)


    //sockets
    window.game.socket.on('connect', function () {
        window.socketId = this.socket.sessionid;
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

            window.game.biome.personnages.splice(exists, 1);
            $('#' + player.id).remove();
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

    var time = Date.now();

    WindowResize(renderer, camera);



    //GAME LOOP
    window.render = function () {
        //Game update loop
        game.update();
        controls.update(Date.now() - time);
        scene.traverse(function (obj) {
            if (obj.id === 10) {
                obj.position.x = controls.getObject().position.x;
                obj.position.y = controls.getObject().position.y;
                obj.position.z = controls.getObject().position.z;
            }
        })
        //Game render loop
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        time = Date.now();
    };
})
