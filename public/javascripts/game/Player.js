var Player = function (id, name, life, element, type) {
    var player = this;
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
    this._ammo = 100;
    this._element = element;
    this._type = type;
    this._items = [];
    this.ath = new ATH();
}

/* Getters & setters */
Player.prototype.get = function (prop) {
    return this[prop];
}
Player.prototype.set = function (prop, value) {
    if (prop === '_life') {
        if (value <= 0) value = 0;
        if (value > 100) value = 100;
    }
    this[prop] = value;
    this.ath.update();
}

Player.prototype.init = function (scene) {
    var bullets = new Bullet();
    console.log('bullets ' + bullets);
    if (window.game.map.currentLevel === "space")
        window.game.map.progressSpace();
}

// Process the character motions
Player.prototype.motion = function () {
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
Player.prototype.update = function () {
    if (this._life <= 0) {
        window.game.GameOver();
    } else {
        this.ath.update();
    }
}

Player.prototype.AI = function () {
    'use strict';
    //loop reading game and readcing about.
}
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Player;
else
    window.Player = Player;
