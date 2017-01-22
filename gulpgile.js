//gulp modules
var gulp = require('gulp');

//tasks
gulp.task('task_name', function() {
    return gulp.src('src/scss/*.+(scss|sass)');
        
        .pipe(gulp.dest('katalog_docelowy'))
});

//task "prod" start task "task_name"
gulp.task('prod', function() {
    gulp.start('task_name');
});

//default task runs when in console use 'gulp' without task name
gulp.task('default', ['task_name']);