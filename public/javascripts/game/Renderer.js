//déssinateur (peut etre a appeler avec un worker pour de meilleur performances...)
$(document).ready(function () {
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
    console.log(game);
    game.map.init();


    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);

    hemiLight.position.set(0, 500, 0);
    scene.add(hemiLight);

    var dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(-1, 0.75, 1);
    dirLight.position.multiplyScalar(50);
    dirLight.name = "dirlight";
    // dirLight.shadowCameraVisible = true;

    scene.add(dirLight);

    dirLight.castShadow = true;
    dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024 * 2;

    var d = 300;

    dirLight.shadowCameraLeft = -d;
    dirLight.shadowCameraRight = d;
    dirLight.shadowCameraTop = d;
    dirLight.shadowCameraBottom = -d;

    dirLight.shadowCameraFar = 3500;
    dirLight.shadowBias = -0.0001;
    dirLight.shadowDarkness = 0.35;

    //fonction qui lance le rendu
    var render = function () {
        scene.simulate();
        requestAnimationFrame(render);

        game.map.particleSystem.rotation.y += 0.000005;

        renderer.render(scene, camera);
    };

    render();
})
