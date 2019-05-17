var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
    return gulp.src('e2e/conf/*.conf')
      .pipe(gulp.dest('dist/e2e/conf/'))
});
