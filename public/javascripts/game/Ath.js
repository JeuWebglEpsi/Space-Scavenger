/* Affichage Tête Haute
 * Gestion de l'affichage en fonction du personnage,
 *
 */
(function () {
    'use strict';
    var ATH = function () {
        var ath = this;
        this.lifebar = 0;
        this.ammo = 0;
    }
    ATH.prototype.get = function (prop) {
        return this[prop];
    }
    ATH.prototype.set = function (prop, value) {
        this[prop] = value;
    }

    ATH.prototype.initialize = function (life, ammo) {
        this.lifebar = life;
        this.ammo = ammo;
    }
    //draw ath
    ATH.prototype.paint = function () {

    }
})()
