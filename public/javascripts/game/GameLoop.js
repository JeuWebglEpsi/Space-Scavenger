require(['jquery', 'three', 'physi', 'pointerlockcontrols', 'resize', 'game', 'audiojs'], function ($, THREE, Physijs, FirstPersonControl, WindowResize, Game, Audio5js) {
    console.log(arguments);
    console.log(FirstPersonControl);
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
    window.scene = new Physijs.Scene({});
    scene.setGravity(new THREE.Vector3(0, 0, 0));


    function buildAxis(src, dst, colorHex, dashed) {
        var geom = new THREE.Geometry(),
            mat;

        if (dashed) {
            mat = new THREE.LineDashedMaterial({
                linewidth: 3,
                color: colorHex,
                dashSize: 3,
                gapSize: 3
            });
        } else {
            mat = new THREE.LineBasicMaterial({
                linewidth: 3,
                color: colorHex
            });
        }

        geom.vertices.push(src.clone());
        geom.vertices.push(dst.clone());
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line(geom, mat, THREE.LinePieces);

        return axis;

    }

    function buildAxes(length) {
        var axes = new THREE.Object3D();

        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0), 0xFF0000, false)); // +X
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-length, 0, 0), 0xFF0000, true)); // -X
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0), 0x00FF00, false)); // +Y
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -length, 0), 0x00FF00, true)); // -Y
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length), 0x0000FF, false)); // +Z
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -length), 0x0000FF, true)); // -Z

        return axes;

    }
    scene.add(buildAxes(1000000));

    var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1e7);
    camera.position.set(0, 0, 0);
    camera.rotation.set(0, 0, 0);

    var cameraCollider = new Physijs.SphereMesh(
        new THREE.SphereGeometry(3),
        new THREE.MeshBasicMaterial({
            color: 0x888888
        })
    );

    cameraCollider.addEventListener('collision', function (obj) {
        console.log('colliding with ' + obj.name + ' ' + obj.id + ' on ' + JSON.stringify(this.position));
    });
    cameraCollider.position.set(0, 0, 0);
    cameraCollider.rotation.set(0, 0, 0);
    cameraCollider.add(camera);
    scene.add(cameraCollider);
    var controls = new FirstPersonControl(cameraCollider);

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

    window.render = function () {
        // cameraCollider.__dirtyRotation = true;

        //Game update loop
        game.update();

        controls.update(Date.now() - time);


        scene.traverse(function (obj) {
            if (obj.name === "bgdCube") {
                //  obj.position.set(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z);
            }
            if (obj.name === "arme") {

                obj.position.x = x;
                obj.position.y = y - 1.5;
                obj.position.z = z;
                // obj.scale.x = obj.scale.z = -10;
                //obj.scale.y= 10;
            }
        })
        scene.simulate();

        //Game render loop
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        time = Date.now();

    };
    $(document).click(function (event) {


        var bullet = new Bullet();
        bullet.position(position, camera);

    })
})
