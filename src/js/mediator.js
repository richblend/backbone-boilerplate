App = window.App || {};

App.Mediator = (function(){
	
	'use strict';

	var events = {};

	var subscribe = function(callback, event){
		if(!events.hasOwnProperty(event)){
			events[event] = [];
		}

		events[event].push(callback);

	}


	var publish = function(event){
		var subscribers = events[event];

		for(var i = 0; i < subscribers.length; i++){
			subscribers[i]();
		}
	}


	return {
		subscribe: subscribe,
		publish: publish
	}


})();