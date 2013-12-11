var Personnage = function (id, name, life, element, type) {
    var personnage = this;
    //id de socket(selecteur unique)
    this._socketId = id;
    //position en cour
    this._position = {
        x: 0,
        y: 0,
        z: 0
    };
    this._name = name;
    this._life = life;
    this._element = element;
    this._type = type;
    this._items = [];
    this.ath = new ATH();
}

/* Getters & setters */
Personnage.prototype.get = function (prop) {
    return this[prop];
}
Personnage.prototype.set = function (prop, value) {
    if (prop === '_life') {
        if (value <= 0) value = 0;
        if (value > 100) value = 100;
    }
    this[prop] = value;
    this.ath.update();
}

Personnage.prototype.init = function () {
    var loader = new THREE.JSONLoader();

    loader.load("/javascripts/Objects/robot.js", function (geometry, materials) {

        var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshFaceMaterial(materials));
        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = 0;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 10 - 1;
        //   scene.add(mesh);

    });
}


// Test and avoid collisions
Personnage.prototype.collision = function () {
    'use strict';
    var collisions, i,
        // Maximum distance from the origin before we consider collision
        distance = 32,
        // Get the obstacles array from our world
        obstacles = window.map.getObstacles();
    // For each ray
    for (i = 0; i < this.rays.length; i += 1) {
        // We reset the raycaster to this direction
        this.caster.set(this.mesh.position, this.rays[i]);
        // Test if we intersect with any obstacle mesh
        collisions = this.caster.intersectObjects(obstacles);
        // And disable that direction if we do
        if (collisions.length > 0 && collisions[0].distance <= distance) {
            // Yep, this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
            if ((i === 0 || i === 1 || i === 7) && this.direction.z === 1) {
                this.direction.setZ(0);
            } else if ((i === 3 || i === 4 || i === 5) && this.direction.z === -1) {
                this.direction.setZ(0);
            }
            if ((i === 1 || i === 2 || i === 3) && this.direction.x === 1) {
                this.direction.setX(0);
            } else if ((i === 5 || i === 6 || i === 7) && this.direction.x === -1) {
                this.direction.setX(0);
            }
        }
    }
},
// Process the character motions
Personnage.prototype.motion = function () {
    'use strict';
    // Update the directions if we intersect with an obstacle
    this.collision();
    // If we're not static
    if (this.direction.x !== 0 || this.direction.z !== 0) {
        // Rotate the character
        this.rotate();
        // Move the character
        this.move();
        return true;
    }
}

Personnage.prototype.AI = function () {
    'use strict';
    //loop reading game and readcing about.
}
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Personnage;
else
    window.Personnage = Personnage;
