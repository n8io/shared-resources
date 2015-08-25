module.exports = function(grunt) {
  grunt.initConfig({
    nodemon: {
      dev: {
        script: 'app.js',
        options : {
          watch: ['app.js','routes/**/*.js', 'controllers/**/*.js', 'config/**/*.json'],
          ext: 'js,json',
          env: {
            PORT: 3002
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-nodemon');

  grunt.option('force', true);

  // Default task(s).
  grunt.registerTask('default', [
    // 'stylus',
    // 'cssmin',
    // 'uglify',
    // 'jade',
    // 'copy'
  ]);

  // For development
  grunt.registerTask('watcher', 'Compiles and minifies css, validates and minify js, compiles jade to html, copies static assets to dist, then watches for changes.', [
    'nodemon'
  ]);
};
