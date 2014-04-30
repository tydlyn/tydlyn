var path = require('path');

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bowerrc: grunt.file.readJSON('.bowerrc'),
		paths: {
			'src': 'client/src',
			'dist': 'server/public',
			'vendors': '<%= bowerrc.directory %>',
			'bootstrap': {
				'js': '<%= paths.vendors %>/bootstrap/js',
				'less': '<%= paths.vendors %>/bootstrap/less'
			},
			'less': '<%= paths.src %>/less/stylesheet.less',
			'javascripts': '<%= paths.src %>/**/*.js'
		},
		/**
		 * The banner is the comment that is placed at the top of our compiled
		 * source files. It is first processed as a Grunt template, where the `<%=`
		 * pairs are evaluated based on this very configuration object.
		 */
		meta: {
			banner:
				'/**\n' +
				' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
				' * <%= pkg.homepage %>\n' +
				' *\n' +
				' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
				' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
				' */\n'
		},
		serverFile: 'server/server.js',
		watch: {
			css: {
				files: ['client/less/*.less'],
				tasks: ['less']
			}
		},
		// Run mocha unit tests
		mochacli: {
			options: {
				ui: 'bdd',
				reporter: 'spec',
				timeout: '15000'
			},
			unit: {
				src: ['server/test/unit/**/*_spec.js']
			}
		},
		less: {
			development: {
				options: {
					relativeUrls: true,
					modifyVars: {
						"images-path": '"/static/images"'
					}
				},
				files: {
					'server/public/stylesheets/stylesheet.min.css': 'client/src/less/stylesheet.less'
				}
			},
			production: {
				options: {
					cleancss: true,
					modifyVars: {
						"images-path": '"/static/images"'
					}
				},
				files: {
					'server/public/stylesheets/stylesheet.min.css': 'client/src/less/stylesheet.less'
				}
			}
		},
		// Converts AngularJS templates to JavaScript
		html2js: {
			app: {
				options: {
					base: 'client/src/app'
				},
				src: ['client/src/**/*.tpl.html'],
				dest: '<%= paths.dist %>/javascripts/templates.js',
				module: 'tydlyn.templates'
			}
		},
		concat: {
			src: {
				options: {
					banner: '<%= meta.banner %>'
				},
				src: ['<%= paths.javascripts %>'],
				dest: '<%= paths.dist %>/javascripts/<%= pkg.name %>.js'
			},
			vendors: {
				src: ['<%= paths.vendors %>/angular/angular.js', '<%= paths.vendors %>/angular-route/angular-route.js'],
				dest: '<%= paths.dist %>/javascripts/vendors.min.js'
			}
		},
		copy: {
			main: {
				files: [
					{expand: true, flatten: true,src: ['client/vendors/bootstrap/dist/fonts/*'], dest: 'server/public/fonts'},
					{expand: true, flatten: true,src: ['client/stylesheets/application.css'], dest: 'server/public/stylesheets', filter: 'isFile'},
					{expand: true, flatten: true,src: ['client/images/*'], dest: 'server/public/images'}
				]
			}
		},
		bower: {
			install: {
				options: {
					targetDir: 'client/requires',
					layout: 'byComponent'
				}
			}
		},
		nodemon: {
			all: {
				script: 'server/server.js',
				options: {
					file: 'server/server.js',
					nodeArgs: ['--debug'],
					ignoredFiles: ['node_modules/**'],
					watchedExtensions: ['js'],
					watchedFolders: ['server'],
					env: {
						PORT: process.env.PORT || 3000
					},
					delayTime: 1,
					cwd: __dirname
				}
			}
		},
		concurrent: {
			all: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},
		open: {
			server: {
				url: 'http://localhost:<%= express.options.port %>'
			}
		}
	});

	grunt.registerTask('default', ['concurrent', 'html2js', 'concat', 'open']);
	grunt.registerTask('validate', 'Run tests and lint code', ['jshint', 'mochacli:unit'])
}