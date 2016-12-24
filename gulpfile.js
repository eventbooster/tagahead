var gulp		= require('gulp')
	, rollup	= require('rollup-stream')
	, source	= require('vinyl-source-stream')
	, path		= require('path')
	, glob		= require('glob')
	, merge		= require('merge-stream');



/**
* Merges ES6 modules
*/ 
gulp.task('rollup', () => {

	// Why do we use glob.sync?
	return merge(glob.sync('./src/*/**.js').map((entry) => {

		return rollup({
			entry: entry
		})
	
		// give the file the name you want to output with. 
		.pipe(source(path.resolve(entry), path.resolve('./src')));

	}))
	
	// and output to ./dist/
	.pipe(gulp.dest('./dist'));

});


/**
* Watcher for rollup
*/
gulp.task('watchRollup', () => {
	gulp.watch('src/*/**.js',['rollup']);
});





/**
* Moves HTML files to dist folder
*/
gulp.task('distHTML', () => {
	gulp.src('src/**/*.html')
		.pipe(gulp.dest('dist'));
});


/**
* Watcher for distHTML
*/
gulp.task('watchHTML', () => {
	gulp.watch('src/**/*.html', ['distHTML']);
});



gulp.task('default', ['rollup', 'watchRollup', 'distHTML', 'watchHTML']);

