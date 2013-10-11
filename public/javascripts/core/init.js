//loader pour l'application web
'use strict';

(function () {
	'use strict';
	window.core = {
		socket: io.connect('http://' + location.host),
		idCanvas: "mainFrame",
		files: [
			"Map", "Biome", "Personnage"
		],
		init: function () {
			console.log('Initializing plateforme');
			var headID = $('head');
			this.files.forEach(function (file) {
				var newScript = document.createElement('script');
				newScript.type = 'text/javascript';
				newScript.src = '/javascripts/core/' + file + '.js';
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
		var mainFrame = $('#mainFrame');
		mainFrame.height(win.height());
		mainFrame.width(win.width());
	}

	loadCore();
	window.addEventListener("resize", sizeMainFrame);

	window.game = {
		biome: new Biome()
	}
	game.localPlayer = new Personnage("Tommy", 100, 100, 'fire');
	game.biome.addInBiome(game.localPlayer);

})();
