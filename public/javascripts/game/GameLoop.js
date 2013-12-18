require(['jquery', 'three', 'physi', 'pointerlockcontrols', 'resize', 'game', 'audiojs'], function ($, THREE, Physijs, FirstPersonControl, WindowResize, Game, Audio5js) {
    console.log(arguments);
    window.runGame = function () {


        $('#game-opt').remove();
        $('.athrenderer').show();

        var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;


        var element = document.body;
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();

        //audio sampling.
        var audio5js = new Audio5js({
            ready: function () {
                this.load('/contact.mp3');
                // this.play();
            }
        });

        window.isBlocked = true;
        //capture du pointeur.
        window.addEventListener('click', function () {

            $('#blocker').addClass('hidden')
        })


        //Initialisation du monde
        Physijs.scripts.worker = '/javascripts/core/lib/physijs_worker.js';
        window.scene = new Physijs.Scene({
            reportsize: 2100,
            fixedTimeStep: 1 / 200
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
        debugaxis(10000);

        window.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1e7);
        camera.rotation.set(0, 0, 0);

        var cameraCollider = new Physijs.SphereMesh(
            new THREE.SphereGeometry(4),
            new THREE.MeshBasicMaterial({
                color: 0x888888
            })
        );

        cameraCollider.addEventListener('collision', function (obj) {
            game.localPlayer.set('_life', game.localPlayer.get('_life') - 10);
            console.log('colliding with ' + obj.name + ' ' + obj.id + ' on ' + JSON.stringify(this.position));
        });
        cameraCollider.rotation.set(0, 0, 0);
        cameraCollider.position.set(0, 0, 8000);

        cameraCollider.add(camera);
        scene.add(cameraCollider);

        var renderer = new THREE.WebGLRenderer({
            antialias: false,
            precision: 'lowp',
            alpha: true,
            premultiplyAlpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;

        renderer.shadowCameraNear = 10;
        renderer.shadowCameraFar = camera.far;
        renderer.shadowCameraFov = 55;

        renderer.shadowMapBias = 0.0039;
        renderer.shadowMapDarkness = 0.5;
        renderer.shadowMapWidth = 1024;
        renderer.shadowMapHeight = 1024;


        $('body').append(renderer.domElement);


        var controls = new FirstPersonControl(cameraCollider);


        window.game = new Game();
        game.map.space();
        //game.map.ship();
        console.log(game.map);

        window.game.createPlayer('local');



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
                    obj.position.set(cameraCollider.position.x, cameraCollider.position.y, cameraCollider.position.z);
                }
                if (obj.name === "arme") {

                    obj.position.x = x;
                    obj.position.y = y - 1.5;
                    obj.position.z = z;
                    // obj.scale.x = obj.scale.z = -10;
                    //obj.scale.y= 10;
                }
            })
            scene.simulate(undefined, 8);



            // var balle = new Physijs.ConvexMesh(
            //     new THREE.SphereGeometry(120000000),
            //     new THREE.MeshBasicMaterial({ color: 0x888888 },0)
            // );

            // balle.position.x = camera.lookAt.x;
            // balle.position.y = camera.lookAt.y;
            // balle.position.z = camera.lookAt.z;

            // scene.add(balle);

            //Game render loop
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            time = Date.now();

        };
        window.render();



        $(document).click(function (event) {


            var bullet = new Bullet();
            //console.log("oueojtfod");
            bullet.position(cameraCollider, camera);

        })
    }
})
