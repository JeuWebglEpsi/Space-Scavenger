//loader pour l'application web

'use strict';
//on définit la méthode watch pour tout les navigateur (seulement sous firefox a la base)
// if (!Object.prototype.watch) {
// 	Object.prototype.watch = function (prop, handler) {
// 		var oldval = this[prop],
// 			newval = oldval,
// 			getter = function () {
// 				return newval;
// 			},
// 			setter = function (val) {
// 				oldval = newval;
// 				return newval = handler.call(this, prop, oldval, val);
// 			};
// 		if (delete this[prop]) { // can't watch constants
// 			if (Object.defineProperty) // ECMAScript 5
// 				Object.defineProperty(this, prop, {
// 					get: getter,
// 					set: setter
// 				});
// 			else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) { // legacy
// 				Object.prototype.__defineGetter__.call(this, prop, getter);
// 				Object.prototype.__defineSetter__.call(this, prop, setter);
// 			}
// 		}
// 	};
// }

// // object.unwatch
// if (!Object.prototype.unwatch) {
// 	Object.prototype.unwatch = function (prop) {
// 		var val = this[prop];
// 		delete this[prop]; // remove accessors
// 		this[prop] = val;
// 	};
// }
//initialisation de core et du resizing
(function () {
    'use strict';
    window.core = {
        //connection de l'utilisateur au serveur temps réel
        socket: io.connect('http://' + location.host)
    }

    var sizeMainFrame = function () {
        console.log("resizing");
        var win = $(window);
        var mainFrame = $('#mainContainer canvas');
        mainFrame.height(win.height());
        mainFrame.width(win.width());
    }
    window.addEventListener("resize", sizeMainFrame);
})();
