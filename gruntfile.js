module.exports = function(grunt) {
    // 加载插件 
    [
        'grunt-contrib-jshint',
        'grunt-exec',
    ].forEach(function(task) {
        grunt.loadNpmTasks(task);
    });
    // 配置插件 
    grunt.initConfig({
        jshint: {
            app: ['meadowlark.js', 'public/js/**/*.js',
                'lib/**/*.js'
            ],
            // qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js'],
        },
        exec: {
            // linkchecker: {
            //     cmd: 'linkchecker http://localhost:3000'
            // }
        }
    });

    // 注册任务 
    grunt.registerTask('default', ['jshint']);
};