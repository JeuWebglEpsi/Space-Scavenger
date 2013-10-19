//Personnage.js
(function () {
	'use strict';
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
		//info relative au gameplay
		this._name = name;
		this._life = life;
		this._element = element;
		this._type = type;
		this._items = [];
	}

	//Propriété
	Personnage.prototype.name = function (name) {
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
	Personnage.prototype.life = function (life) {
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

	Personnage.prototype.type = function (type) {
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
	Personnage.prototype.setSocketId = function (id) {
		var personnage = this;
		personnage._socketId = id;
	}
	Personnage.prototype.getSocketId = function () {
		var personnage = this;
		return personnage._socketId;
	}
	//Gestion du positionnement (watch to redraw)
	Personnage.prototype.getPosition = function () {
		return this._position;
	}
	Personnage.prototype.setPosition = function (position) {
		this._position = position;
	}
	//déplaceur
	Personnage.prototype.moveUpX = function () {
		this._position.x += 1;
		camera.position.z -= 1;
	}
	Personnage.prototype.moveUpY = function () {
		this._position.y += 1;
		camera.position.y += 1;
	}
	Personnage.prototype.moveUpZ = function () {
		this._position.z += 1;
		camera.position.x += 1
	}
	Personnage.prototype.moveDownX = function () {
		this._position.x -= 1;
		camera.position.z += 1
	}
	Personnage.prototype.moveDownY = function () {
		this._position.y -= 1;
		camera.position.y -= 1
	}
	Personnage.prototype.moveDownZ = function () {
		if (this._position.z === 0) return;
		this._position.z -= 1;
		camera.position.x -= 1
	}

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
		module.exports = Personnage;
	else
		window.Personnage = Personnage;
})()
