// Wrapper function with one parameter
module.exports = function(grunt) {
	// This banner gets inserted at the top of the generated files, such a minified CSS
	var bannerContent = '/*!\n' +
						' * <%= pkg.name %>\n'+
						' * Version: <%= pkg.version %>\n'+
						' * Build date: <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>\n'+
						' */\n\n';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		clean: ['tmp', 'dist/js'],
		

		jshint: {
			files: ['src/js/*.js'],
			options: {
				forin: true,
				noarg: true,
				noempty: true,
				eqeqeq: true,
				bitwise: true,
				undef: true,
				unused: true,
				curly: true,
				browser: true,
				devel: true,
				jquery: true,
				indent: true,
				maxerr: 25
				
			},
		},


		concat: {
			options: {
				banner: bannerContent
			},
			
			/* Build any vendor scrips we feel appropriate into one file vendor.js. Order is specified */
			vendor: {
				src: [
					'bower_components/jquery/dist/jquery.js',
					'bower_components/underscore/underscore.js',
					'bower_components/backbone/backbone.js'
					
				],
				dest: 'tmp/js/vendor/vendor.js'
			},

			source: {
				src: ['src/js/**/*.js', '!src/js/vendor/**/*.js'],
				dest: 'tmp/js/main.js'
			}
			
			
			
		},


		copy: {
			
			build: {
				files: [
					
					/* copy modernizr file on its own, as it cant be concatenated witjh other vendor files */
					{src: 'bower_components/modernizr/modernizr.js', dest: 'dist/js/vendor/modernizr.js'},
					//copy index file to tmp
					{src: 'src/index.html', dest: 'tmp/index.html'}
					
				]
			},

			dev: {
				files: [
					
					/* copy the modules - slightly more complicated syntax here to preserve the folder structure nicely */
					{cwd: 'src/js', src: '**/*', dest: 'dist/js', expand: true},
					/* copy modernizr file on its own, as it cant be concatenated witjh other vendor files */
					{src: 'bower_components/modernizr/modernizr.js', dest: 'dist/js/vendor/modernizr.js'},
					/* copy concatenated (but not uglified) vendor files */
					{src: 'tmp/js/vendor/vendor.js', dest: 'dist/js/vendor/vendor.js'},
					//copy index file to tmp
					{src: 'src/index.html', dest: 'tmp/index.html'}
				]
			}
			
		},


		requirejs: {
			compile: {
			    options: {
		         	appDir: "src/js/",
		         	baseUrl: ".",
		         	dir: "tmp/js",
		         	modules: [{name: 'main'}],
		         	mainConfigFile: "src/js/main.js"
		          
		        }
		  	}
		},


		uglify: {
			
			options: {
				preserveComments: 'some'
			},

			build : {
				files: [
					{src : 'tmp/js/vendor/vendor.js', dest : 'dist/js/vendor/vendor.js'},
					{src : 'tmp/js/main.js', dest : 'dist/js/main.js'}
				]
			}
		},


		'string-replace': {
			build: {
				files: {
					'dist/index.html': 'tmp/index.html'
				},
				options: {
					replacements: [
						{
							pattern: /%cachebust%/g,
							replacement: '<%= pkg.version %>'
						}
					]
				}
			},
			dev: {
				files: {
					'dist/index.html': 'tmp/index.html'
				},
				options: {
					replacements: [
						{
							pattern: /%cachebust%/g,
							replacement: new Date().getTime()
						}
					]
				}
			}
		},


		sass: {
			dev: {
				options: {
					style: 'expanded',
					compass: false
				},
				files: {
					'dist/css/main.css': 'src/scss/main.scss',
				}
			}
		},

		autoprefixer: {

		    options: {
		      // Task-specific options go here.
		    },

		    // prefix the specified file
		    single_file: {
				options: {
					// Target-specific options go here.
				},
				src: 'dist/css/main.css',
      			dest: 'dist/css/main.css'
      		}
		},


		cssmin: {
			
			target : {
				src : ['dist/css/main.css'],
				dest : 'dist/css/main.css'
			}
		},


		watch: {
			sass: {
				files: ['src/scss/*.scss'],
				tasks: ['sass', 'autoprefixer'],
			},
			scripts: {
				files: ['src/js/**/*.js'],
				tasks: ['clean', 'concat', 'copy:dev', 'injector:dev', 'string-replace:dev' ],
			},
			html: {
				files: ['src/*.html'],
				tasks: ['copy:dev', 'injector:dev', 'string-replace:dev']
			}
		},

		


		connect: {
		    server: {
				options: {
					keepalive: true,
					port: 9001,
					base: 'dist',
					middleware: function(connect) {
					    return [
					      
							connect().use('/bower_components', connect.static('./bower_components')),
							connect.static('dist')
					      
					    ];
					}
				}
		    },

		    testServer:{
		    	options: {
					keepalive: true,
					port: 9002,
					base: './'
				}
		    }
		},


		open : {
		    test: {
		      path: 'http://0.0.0.0:9002/tests/SpecRunner.html',
		      app: 'Google Chrome'
		    },
		    dist: {
		      path: 'http://0.0.0.0:9001/',
		      app: 'Google Chrome'
		    }
		},

		injector: {
		    
		    dev: {
		    	
		    	options: {
		    		template: 'tmp/index.html',
		    		transform: function (file) {
						var arr = file.split('/');
						arr.splice(0, 2);
						var filePath = arr.join('/');
						return '<script src="' + filePath + '?cachebust='+Math.random()+'"></script>';	
					}
		    	},
				files: {
					//inject vendor at top, then the source. Exclude vendor dir as its already been concatenated into vendor js.
					'tmp/index.html': ['dist/js/vendor/vendor.js', 'src/js/**/*.js', '!src/js/vendor/**/*.js']

				}
			},

			build: {
		    	
		    	options: {
		    		template: 'tmp/index.html',
		    		transform: function (file) {
						
						var arr = file.split('/');
						arr.splice(0, 2);
						var filePath = arr.join('/');
						return '<script src="' + filePath + '?v=%cachebust%"></script>';	
					}
		    	},
				files: {
					'tmp/index.html': ['dist/js/vendor/vendor.js', 'dist/js/main.js']

				}
			}
		 },


	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-injector');


	/* available tasks :

		- build: Do the final build.
		- run: Do a dev build
		- watch: Same as dev build
		- serve: Run local server on 9001

	*/
	

	
	grunt.registerTask('build', [
		//clean tmp + dist/js directories
		'clean', 
		
		//concatenate  vendor files (probably mostly from bower_components, but also from wherever we want) into one file and copy that to tmp
		'concat:vendor', 
		//concatenate  source files into tmp
		'concat:source', 
		//copy required files (ones that are already minified) from tmp to dist
		'copy:build', 
		//uglify other files (that also need minification) to dist
		'uglify',
		//inject script tags into html
		'injector:build',
		//copy index.html to tmp while doing some str replaces on it.
		'string-replace:build',
		
		//compile sass
		'sass',
		//add vendor prefixes to compiled css files
		'autoprefixer',

		'cssmin'
		
	]);

	

	grunt.registerTask('run', [
		//clean tmp + dist/js directories
		'clean', 
		//concatenate vendor files (probably mostly from bower_components) into one file and copy that to tmp
		'concat', 
		//copy all other JS files into dist
		'copy:dev',
		//inject script tags into html
		'injector:dev',
		//copy index.html to tmp while doing some str replaces on it
		'string-replace:dev',
		
		//compile sass
		'sass',
		//add vendor prefixes to compiled css files
		'autoprefixer'
	]);

	grunt.registerTask('serve', [
		'open:dist',
		'connect:server'
		
	]);

	

	grunt.registerTask('test', [
		'run',
		'open:test',
		'connect:testServer'
		
	]);

};