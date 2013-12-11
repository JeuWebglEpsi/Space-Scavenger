require(['jquery', 'three', 'physi', 'pointerlockcontrols', 'resize', 'game', 'audiojs', 'bullet'], function ($, THREE, Physijs, PointerLockControls, WindowResize, Game, Audio5js) {
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

    //audio sampling.
    var audio5js = new Audio5js({
        ready: function () {
            this.load('/contact.mp3');
            //this.play();
        }
    });


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
    window.scene = new Physijs.Scene({
        fixedTimeStep: 1 / 30
    });
    scene.setGravity(new THREE.Vector3(0, 0, 0));

    var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1e7);
    camera.position.set(0, 0, 0);

    var controls = new PointerLockControls(camera);
    controls.enabled = true;

    scene.add(controls.getObject());

    var cameraCollider = new Physijs.SphereMesh(new THREE.SphereGeometry(3),
        Physijs.createMaterial(
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: true
            }),
            1,
            0
        ), 10000);
    cameraCollider.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
        console.log('cameraCollider ' + this.id + ' in collision with ' + other_object.id + ' ' + other_object.name);
    });
    scene.add(cameraCollider);



    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        precision: 'lowp'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);


    $('body').append(renderer.domElement);

    window.game = new Game();
    //game.map.space();
    game.map.ship();
    console.log(game.map);


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
    //console.log(cameraCollider.position);
    var position = new THREE.Vector3(controls.getObject().position.x,controls.getObject().position.y,controls.getObject().position.z);
    window.render = function () {
        //Game update loop
        game.update();
       /* console.log('collider');
        console.log(cameraCollider.position)
        console.log('controls');
        console.log(controls.getObject().position);*/
        cameraCollider.position.set(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z);
        controls.update(Date.now() - time);

        scene.traverse(function (obj) {
            if (obj.name === "bgdCube") {
                obj.position.set(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z);
            }
            
                position.x = controls.getObject().position.x;
                position.y = controls.getObject().position.y;
                position.z = controls.getObject().position.z;
                
        })
        scene.simulate();

        //Game render loop
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        time = Date.now();

    };
    $(document).click(function(event) {
        
    
            var bullet = new Bullet();
            bullet.position(position);
        
    })
})