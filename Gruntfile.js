'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        connect: {
            options: {
				base: './src',
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
				keepalive: true,
				open: true
            },
			server: {}
        }
    });

	grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('server', [
		'connect'
    ]);

    grunt.registerTask('default', [
        'server'
    ]);


};

