//Personnage.js
(function() {
	'use strict';
	var Personnage = function(id, name, life, element, type) {
		var personnage = this;
		//id de socket(selecteur unique)
		this._socketId = id;
		//position en cour
		this._position = {
			x: 0,
			y: 0,
			z: 0
		};
		//info relative au gameplay
		this._name = name;
		this._life = life;
		this._element = element;
		this._type = type;
		this._items = [];
	}

	//Propriété
	Personnage.prototype.name = function(name) {
		if (typeof name == "String") {
			throw new Error("Name must be a String");
		}
		var personnage = this;
		if (name) {
			return this._name = name;
		} else {
			return this._name;
		}
	}
	Personnage.prototype.life = function(life) {
		if (NaN === parseInt(life)) {
			throw new Error("Life must be a number");
		}
		var personnage = this;
		if (life) {
			return this._life = life;
		} else {
			return this._life;
		}
	}

	Personnage.prototype.type = function(type) {
		if (typeof type == "String") {
			throw new Error("Type must be a String");
		}
		var personnage = this;
		if (type) {
			return this._type = type;
		} else {
			return this._type;
		}
	}
	Personnage.prototype.setSocketId = function(id) {
		var personnage = this;
		personnage._socketId = id;
	}
	Personnage.prototype.getSocketId = function() {
		var personnage = this;
		return personnage._socketId;
	}
	//Gestion du positionnement (watch to redraw)
	Personnage.prototype.getPosition = function() {
		return this._position;
	}
	Personnage.prototype.setPosition = function(position) {
		this._position = position;
	}
	//déplaceur
	Personnage.prototype.moveUpX = function() {
		this._position.x += 1;
		camera.position.z -= 1;
	}
	Personnage.prototype.moveUpY = function() {
		this._position.y += 1;
		camera.position.y += 1;
	}
	Personnage.prototype.moveUpZ = function() {
		this._position.z += 1;
		camera.position.x += 1
	}
	Personnage.prototype.moveDownX = function() {
		this._position.x -= 1;
		camera.position.z += 1
	}
	Personnage.prototype.moveDownY = function() {
		this._position.y -= 1;
		camera.position.y -= 1
	}
	Personnage.prototype.moveDownZ = function() {
		if (this._position.z === 0) return;
		this._position.z -= 1;
		camera.position.x -= 1
	}


	Personnage.prototype.init = function(args) {
		/* ... */
		// Set the character modelisation object
		this.mesh = new THREE.Object3D();
		/* ... */
		// Set the rays : one vector for every potential direction
		this.rays = [
			new THREE.Vector3(0, 0, 1),
			new THREE.Vector3(1, 0, 1),
			new THREE.Vector3(1, 0, 0),
			new THREE.Vector3(1, 0, -1),
			new THREE.Vector3(0, 0, -1),
			new THREE.Vector3(-1, 0, -1),
			new THREE.Vector3(-1, 0, 0),
			new THREE.Vector3(-1, 0, 1)
		];
		// And the "RayCaster", able to test for intersections
		this.caster = new THREE.Raycaster();
		return this.mesh;
	}
	// Test and avoid collisions
	Personnage.prototype.collision = function() {
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
	Personnage.prototype.motion = function() {
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


	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
		module.exports = Personnage;
	else
		window.Personnage = Personnage;
})()
