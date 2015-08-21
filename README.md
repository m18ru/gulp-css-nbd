# gulp-css-nbd
> CSS nesting by directory gulp plugin

## Description

Plugin for building very specific selectors by directory structure like:

src/
- 010_reset/
  - …
- 100_globals/
  - mixins/
    - …
  - animations.less
  - colors.less
  - constants.less
  - fonts.less
  - levels.less
  - media.less
  - variables.less
- 200_text/
  - a.less
- 300_html/
  - body/
    - footer/
      - &.less
      - p.copyright.less
    - header/
      - !_variables.less
      - &.less
      - a.logo.less
      - nav.main.less
    - main/
      - form/
        - ul.fields/
          - &.less
          - li.less
          - li.controls.less
          - li.text.less
          - li.textarea.less
      - !table.less
      - &.less
      - h1.less
      - h2.less
      - ol,ul.less
      - p.less
    - &.less
    - nav.breadcrumbs.less

With *300_html* as entry point for building selectors like:

`html > body > main table {`

or

`html > body > form > ul.fields > li.text {`

## Usage

Install with npm:

```shell
npm install --save gulp-css-nbd
```

And use:

```javascript
var gulp = require( 'gulp' );
var cssNdb = require( 'gulp-css-nbd' );
var concat = require( 'gulp-concat' );
var less = require( 'gulp-less' );

gulp.task(
	'default',
	function ()
	{
		gulp.src( './styles/src/**/*.less' )
			.pipe( cssNdb() )
			.pipe( concat( 'common.less' ) )
			.pipe( less() )
			.pipe( gulp.dest( './styles/' ) );
	}
);
```
