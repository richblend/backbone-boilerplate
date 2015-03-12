describe("Burrito Model", function(){

	define(['/dist/js/models/burrito.js'], function(BurritoModel){			
	
		it("should have defaults", function(){
			
			var model = new BurritoModel();
			expect(model.defaults).not.toBeUndefined();
		});

		

	});


	//more tests please

		

});