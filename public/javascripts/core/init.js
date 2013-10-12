//loader pour l'application web
'use strict';
if (!Object.prototype.watch) {
	Object.prototype.watch = function (prop, handler) {
		var oldval = this[prop],
			newval = oldval,
			getter = function () {
				return newval;
			},
			setter = function (val) {
				oldval = newval;
				return newval = handler.call(this, prop, oldval, val);
			};
		if (delete this[prop]) { // can't watch constants
			if (Object.defineProperty) // ECMAScript 5
				Object.defineProperty(this, prop, {
					get: getter,
					set: setter
				});
			else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) { // legacy
				Object.prototype.__defineGetter__.call(this, prop, getter);
				Object.prototype.__defineSetter__.call(this, prop, setter);
			}
		}
	};
}

// object.unwatch
if (!Object.prototype.unwatch) {
	Object.prototype.unwatch = function (prop) {
		var val = this[prop];
		delete this[prop]; // remove accessors
		this[prop] = val;
	};
}

(function () {
	'use strict';

	window.core = {
		socket: io.connect('http://' + location.host),
		idCanvas: "mainFrame",
		files: [
			"Renderer", "Biome", "Personnage", "Game", "Keyboard", "Map"
		],
		init: function () {
			console.log('Initializing plateforme');
			var headID = $('head');
			this.files.forEach(function (file) {
				var newScript = document.createElement('script');
				newScript.type = 'text/javascript';
				newScript.src = '/javascripts/game/' + file + '.js';
				headID.append(newScript);
			})
			console.log('Plateforme initialized');
		},
	}


	var loadCore = function () {
		core.init();
	};
	var sizeMainFrame = function () {
		console.log("resizing");
		var win = $(window);
		var mainFrame = $('#mainContainer canvas');
		mainFrame.height(win.height());
		mainFrame.width(win.width());
	}

	loadCore();


	window.addEventListener("resize", sizeMainFrame);


})();
