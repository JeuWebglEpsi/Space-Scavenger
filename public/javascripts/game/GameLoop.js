require(['jquery', 'three', 'physi', 'pointerlockcontrols', 'resize', 'game', 'audiojs'], function ($, THREE, Physijs, FirstPersonControl, WindowResize, Game, howl) {
    console.log(arguments);
    window.runGame = function (level) {
        window.sound;
        console.log('Running game ' + level)

        var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;


        var element = document.body;
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();

        //audio sampling.
        if (window.sound) {
            window.sound.stop();
        }


        window.isBlocked = true;
        //capture du pointeur.
        window.addEventListener('click', function () {

            $('#blocker').addClass('hidden')
        })


        //Initialisation du monde
        Physijs.scripts.worker = '/javascripts/core/lib/physijs_worker.js';
        window.scene = new Physijs.Scene({
            reportsize: 2100,
            fixedTimeStep: 1 / 100
        });


        scene.setGravity(new THREE.Vector3(0, 0, 0));

        var debugaxis = function (axisLength) {
            //Shorten the vertex function
            function v(x, y, z) {
                return new THREE.Vertex(new THREE.Vector3(x, y, z));
            }

            //Create axis (point1, point2, colour)
            function createAxis(p1, p2, color) {
                var line, lineGeometry = new THREE.Geometry(),
                    lineMat = new THREE.LineBasicMaterial({
                        color: color,
                        lineWidth: 1
                    });
                lineGeometry.vertices.push(p1, p2);
                line = new THREE.Line(lineGeometry, lineMat);
                scene.add(line);
            }

            createAxis(v(-axisLength, 0, 0), v(axisLength, 0, 0), 0xFF0000);
            createAxis(v(0, -axisLength, 0), v(0, axisLength, 0), 0x00FF00);
            createAxis(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF);
        };

        //To use enter the axis length
        //debugaxis(10000);

        window.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1e7);
        camera.rotation.set(0, 0, 0);

        var cameraCollider = new Physijs.SphereMesh(
            new THREE.CylinderGeometry(.4, .4, 60),
            new THREE.MeshBasicMaterial({
                color: 0x888888
            })
        );
        cameraCollider.name = "cameraCollider";
        cameraCollider.addEventListener('collision', function (obj) {
            //window.game.localPlayer.set('_life', window.game.localPlayer.get('_life') - 20);
            //console.log('colliding with ' + obj.name + ' ' + obj.id + ' on ' + JSON.stringify(this.position));
        });
        cameraCollider.rotation.set(0, 0, 0);

        var flash = new THREE.PointLight(0xFFFFFF, 1, 400);
        flash.position.set(0, 0, 0);
        cameraCollider.add(flash);
        window.cameraCollider = cameraCollider;
        if (level === 1) {
            window.sound = new howl.Howl({
                urls: ['contact.ogg'],
                loop: true,
                buffer: true
            }).play();
            cameraCollider.position.set(0, 0, 8000);
        } else if (level === 2) {
            cameraCollider.position.set(850, 30, -950);
            window.sound = new howl.Howl({
                urls: ['Myst.ogg'],
                loop: true,
                buffer: true
            }).play();

        }


        cameraCollider.add(camera);
        scene.add(cameraCollider);

        var renderer = new THREE.WebGLRenderer({
            antialias: true,
            precision: 'lowp',
            alpha: true,
            premultiplyAlpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;



        $('body').append(renderer.domElement);


        window.controls = new FirstPersonControl(cameraCollider);


        window.game = new Game();

        if (level === 1)
            game.map.space();
        else if (level === 2)
            game.map.ship();


        window.game.createPlayer('local');

        setTimeout(function () {
            $(document).trigger('gameReady');
        }, 4000)

        /*END MAYBE*/

        var time = Date.now();

        WindowResize(renderer, camera);

        window.render = function () {

            //Game update loop
            game.update();


            scene.traverse(function (obj) {
                if (obj.name === "bgdCube") {
                    obj.position.set(cameraCollider.position.x, cameraCollider.position.y, cameraCollider.position.z);
                }

            })
            scene.simulate(1 / 100, 16);
            controls.update(Date.now() - time);

            window.isRendering = requestAnimationFrame(render);
            renderer.render(scene, camera);
            time = Date.now();
        };
        window.render();



        $(document).click(function (event) {
            var bullet = new Bullet();
            bullet.position(cameraCollider, camera);
        })
    }
})
