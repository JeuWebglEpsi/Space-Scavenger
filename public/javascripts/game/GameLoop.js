//déssinateur (peut etre a appeler avec un worker pour de meilleur performances...)
$(document).ready(function () {
    /* MAYBE MOVE IT TO GAME*/
    Physijs.scripts.worker = '/javascripts/core/lib/physijs_worker.js';

    window.scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3(0, -30, 0));


    window.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000000);

    window.renderer = new THREE.WebGLRenderer({
        antialias: true,
        precision: 'highp'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    $('body').append(renderer.domElement);

    window.game = new Game();
    game.map.space();


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
