App = window.App || {};

App.Main = (function(){

	'use strict';
	
	var init = function(){
		App.Router.init();
	} 

	
	return {
		init: init
	}


})();


$().ready(function(){
	App.Main.init();
});