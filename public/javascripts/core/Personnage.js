//Peronnage.js
var Personnage = function (name, life, armor, type) {
	var personnage = this;
	this._id;
	this._socketId;
	this._position = {
		x: 0,
		y: 0,
		z: 0
	};
	this._name = name;
	this._life = life;
	this._armor = armor;
	this._type = type;
	this._items = [];
}

//Propriété accessor
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
Personnage.prototype.armor = function (armor) {
	if (NaN === parseInt(armor)) {
		throw new Error("armor must be a number");
	}
	var personnage = this;
	if (armor) {
		return this._armor = armor;
	} else {
		return this._armor;
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

//Gestion du positionnement (watch to redraw)
Personnage.prototype.getPosition = function () {
	return this._position;
}
Personnage.prototype.setPosition = function (position) {
	this._position = position;
}
Personnage.prototype.moveUpX = function () {
	console.log(this.name() + " moving up " + this._position.x);
	this._position.x += 1;
}
Personnage.prototype.moveUpY = function () {
	console.log(this.name() + " moving right " + this._position.y);
	this._position.y += 1;
}
Personnage.prototype.moveUpZ = function () {
	console.log(this.name() + " jumping " + this._position.z);

	this._position.z += 1;
}
Personnage.prototype.moveDownX = function () {
	console.log(this.name() + " moving down " + this._position.x);
	this._position.x -= 1;
}
Personnage.prototype.moveDownY = function () {
	console.log(this.name() + " moving left " + this._position.y);
	this._position.y -= 1;
}
Personnage.prototype.moveDownZ = function () {
	console.log(this.name() + " crouch " + this._position.z);
	if (this._position.z === 0) return;
	this._position.z -= 1;
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
	module.exports = Personnage;
else
	window.Personnage = Personnage;
