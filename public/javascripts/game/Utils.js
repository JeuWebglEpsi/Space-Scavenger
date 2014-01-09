/**
 * Classe util pour créer facilement des elements du monde
 */
var Utils = function () {
    this.loader = new THREE.JSONLoader();
}
/**
 * Creation du skybox
 * @return nothing
 */
Utils.prototype.createWorld = function () {
    var utils = this;
    this.loader.load("/javascripts/Maps/bgd2.js", function (geometry, materials) {
        var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        mesh.name = "bgdCube";
        mesh.material.depthWrite = false;
        mesh.receiveShadow = false;
        mesh.scale.set(-2000, -2000, -2000);
        window.scene.add(mesh);
    });
}
/**
 * Créé des astéroides
 * @param  {[number]} position                 tableau de position
 * @param  {[number]} rotation                 tableau de rotation
 * @param  {[number]} scale                      tableau d'échelle
 * @param  {[function]} collision_action_perform  handler de collision
 * @return {[]}
 */
Utils.prototype.createAsteroid = function (position, rotation, scale, collision_action_perform) {
    var utils = this;
    loader.load("/javascripts/Maps/asteroid.js", function (geometry, materials) {
        var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshFaceMaterial(materials), 10000 * weight);
        mesh.position = position;
        mesh.rotation = rotation;
        mesh.scale = scale;

        mesh.receiveShadow = true;
        mesh.castShadow = true;

        mesh.name = "asteroid";
        mesh.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            utils.collision_action_perform(this, other_object);
        });
        scene.add(mesh);
    });
};
/**
 * Créé un vaisseau (pas la map vaisseau)
 * @param  {number} position                 position
 * @param  {number} rotation                 rotation
 * @param  {number} scale                    échelle
 * @param  {function} collision_action_perform handler de collision
 * @return {nothing}
 */
Utils.prototype.createShip = function (position, rotation, scale, collision_action_perform) {
    var utils = this;
    loader.load('/javascripts/Maps/ship.js', function (geometry, materials) {
        var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshFaceMaterial(materials), 1e10);
        mesh.rotation = rotation;
        mesh.position = position;
        mesh.scale = scale;

        mesh.material.shading = THREE.FlatShading;

        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.addEventListener('collision', function (other_object) {
            utils.collision_action_perform(this, other_object);
        })
        scene.add(mesh);

    })
}
/**
 * Créé un loot
 * @param  {number} position                 position
 * @param  {number} rotation                 rotation
 * @param  {number} scale                    scale
 * @param  {string} type                     Type d'objet a crééer
 * @param  {function} collision_action_perform handler de collision
 * @return {nothing}
 */
Utils.prototype.createLoot = function (position, rotation, scale, type, collision_action_perform) {
    var utils = this;
    var texture, mesh;
    texture = THREE.ImageUtils.loadTexture('/javascripts/Maps/' + type + '.jpg');
    mesh = new Physijs.BoxMesh(cube,
        new THREE.MeshLambertMaterial({
            map: texture
        }),
        0);
    mesh.name = "toHighlight";
    mesh.position = position;
    mesh.rotation = rotation;
    mesh.scale = scale;
    mesh.position.y += 1;

    mesh.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
        utils.collision_action_perform(this, other_object, relative_velocity, relative_rotation, contact_normal);
    })

    window.scene.add(mesh);
}

/**
 * Handler de collision
 * @param  {Mesh} first_object  Object appelant la fonction
 * @param  {Mesh} second_object Object en relation avec l'appelant
 * @return {nothing}
 */
Utils.prototype.collision_action_perform = function (first_object, second_object, relative_velocity, relative_rotation, contact_normal) {
    var utils = this;
    //TODO big switch

    if (first_object.name === "asteroid"){
        if (second_object.name === "bullet") {

        }
    }

    if (first_object.name === "wall_breakable"){
        if (second_object.name === "bullet") {
            first_object.life--;
            if (first_object.life === 0) {
                window.scene.remove(first_object); 
                //Création de petit bout de mur
                var i = 5;
                while (i--) {
                    var miniwall = new Physijs.BoxMesh(
                        new THREE.CubeGeometry(10, 10, 10),
                        new THREE.MeshLambertMaterial({
                            map: THREE.ImageUtils.loadTexture('/javascripts/Maps/shiphull-Porte2.jpg')
                        }),
                        10
                    );
                    var nb = Math.random();
                    var signe = "";
                    if (nb >= 0.5)
                        signe = 1;
                    else
                        signe = -1

                    miniwall.position.x = first_object.position.x + (Math.random() * signe);
                    miniwall.position.y = first_object.position.y + (Math.random() * signe);
                    miniwall.position.z = first_object.position.z + (Math.random() * signe);
                    
                    scene.add(miniwall);
                }
            }
        } 
    }

    if (first_object.name === "mechant_robot"){
        if (second_object.name === "bullet") 
    }

    if (first_object.name === "super_mechant_robot"){
        if (second_object.name === "bullet") 
    }

    
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Utils;
else
    window.Utils = Utils;
