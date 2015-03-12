/*!
 * Backbone and Boilerplate
 * Version: 1.0.0
 * Build date: 2015-03-12 14:58:37
 */
var App=App||{};App.Main=function(){"use strict";var a=function(){App.Router.init()};return{init:a}}(),$().ready(function(){App.Main.init()});var App=App||{};App.Mediator=function(){"use strict";var a={},b=function(b,c){a.hasOwnProperty(c)||(a[c]=[]),a[c].push(b)},c=function(b){for(var c=a[b],d=0;d<c.length;d++)c[d]()};return{subscribe:b,publish:c}}();var App=App||{};App.Router=function(){"use strict";var a,b=function(){var b=Backbone.Router.extend({routes:{"":"default"}});a=new b,a.on("route",function(a){console.log("on route:",a)}),Backbone.history.start()};return{init:b}}();