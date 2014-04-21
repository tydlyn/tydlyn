var path = require('path');

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: '<json:package.json>',
		bowerrc: grunt.file.readJSON('.bowerrc'),
		paths: {
			'vendor': '<%= bowerrc.directory %>',
			'bootstrap': {
				'js': '<%= paths.vendors %>/bootstrap/js',
				'less': '<%= paths.vendors %>/bootstrap/less'
			},
			'css': 'css',
			'less': 'less',
			'js': 'js'
		},
		serverFile: 'server/server.js',
		watch: {
			css: {
				files: ['client/stylesheets/*.css'],
				tasks: ['copy']
			}
		},
		copy: {
			main: {
				files: [
					{expand: true, flatten: true,src: ['client/vendors/bootstrap/dist/css/bootstrap.min.css'], dest: 'server/public/css', filter: 'isFile'},
					{expand: true, flatten: true,src: ['client/vendors/bootstrap/dist/fonts/*'], dest: 'server/public/fonts'},
					{expand: true, flatten: true,src: ['client/stylesheets/application.css'], dest: 'server/public/css', filter: 'isFile'}
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
		less: {
			boldy: {
				options: {
					compress: true,
					cleancss: true,
					report: 'gzip',
					strictImports: true,
				},
				files: { '<%= src.output.boldy.css.screen %>': '<%= src.input.less %>'}
			},
			boldy_debug: {
				options: {
					compress: false,
					cleancss: false,
					report: 'none',
					strictImports: true,
				},
				files: { '<%= src.output.boldy.css.screen %>': '<%= src.input.less %>'}
			},
			bootstrap: {
				files: { '<%= src.output.bootstrap.css %>': '<%= src.input.bootstrap.less %>'}
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



	grunt.registerTask('default', ['concurrent', 'open']);
}