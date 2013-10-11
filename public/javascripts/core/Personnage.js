//Peronnage.js
var Personnage = function (name, life, armor, type) {
	var personnage = this;
	this._id;
	this._socketId;
	this._position = [];
	this._name = name;
	this._life = life;
	this._armor = armor;
	this._type = type;
	this._items = [];
}

//Propriété accessor
Personnage.prototype.name = function (name = null) {
	if (name typeof "String") {
		throw new Error("Name must be a String");
	}
	var personnage = this;
	if (name) {
		return this._name = name;
	} else {
		return this._name;
	}
}
Personnage.prototype.life = function (life = null) {
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
Personnage.prototype.armor = function (armor = null) {
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
Personnage.prototype.type = function (type = null) {
	if (type typeof "String") {
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
Peronnage.prototype.setPosition = function (position) {
	this._position = position;
}
Personnage.prototype.moveUpX = function () {
	this._position.x += 1;
}
Personnage.prototype.moveUpY = function () {
	this._position.y += 1;
}
Personnage.prototype.moveUpZ = function () {
	this._position.z += 1;
}
Personnage.prototype.moveDownX = function () {
	this._position.x -= 1;
}
Personnage.prototype.moveDownY = function () {
	this._position.y -= 1;
}
Personnage.prototype.moveDownZ = function () {
	if (this._position.z === 0) return;
	this._position.z -= 1;
}
