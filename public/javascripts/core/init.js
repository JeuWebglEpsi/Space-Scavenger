//loader pour l'application web
'use strict';

(function () {
	'use strict';
	var core = {
		files: [
			"Map", "Biome", "Keyboard", "Personnage"
		],
		init: function () {
			console.log('initializing');
			var headID = document.getElementsByTagName("head")[0];
			this.files.forEach(function (file) {
				var newScript = document.createElement('script');
				newScript.type = 'text/javascript';
				newScript.src = '/javascripts/core/' + file + '.js';
				headID.appendChild(newScript);
			})
			console.log('initialized');
		},
	}
	var loadCore = function () {
		core.init();
	}();
	var sizeMainFrame = function () {
		console.log("resizing");
		var win = $(window);
		var mainFrame = $('#mainFrame');
		mainFrame.height(win.height());
		mainFrame.width(win.width());
	}


	window.addEventListener("resize", sizeMainFrame);
})();
