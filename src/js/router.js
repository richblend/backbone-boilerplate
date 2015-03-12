var App = App || {};

App.Router = (function(){

	'use strict';

	var router;

	var init = function(){

		var Router = Backbone.Router.extend({

			routes: {
				'': 'default'
			}

		});

		router = new Router();

		router.on('route', function(route){
			console.log('on route:', route);
			
		});

		Backbone.history.start(); 


	}

	

	return {
		init: init
	}

})();


