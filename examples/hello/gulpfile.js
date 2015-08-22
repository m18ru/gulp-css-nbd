var gulp = require( 'gulp' );
var concat = require( 'gulp-concat' );
var less = require( 'gulp-less' );
var cssNdb = require( 'gulp-css-nbd' );

gulp.task(
	'default',
	function ()
	{
		gulp.src( './styles/common.src/**/*.less' )
			.pipe( cssNdb() )
			.pipe( concat( 'common.less' ) )
			.pipe( less() )
			.pipe( gulp.dest( './styles/' ) );
	}
);
