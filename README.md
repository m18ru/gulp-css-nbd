# gulp-css-nbd
> CSS nesting by directory gulp plugin

## Description

Part of [Nest-CSS methodology](https://github.com/m18ru/nest-css).

Plugin for building very specific selectors by directory structure like:

src/
- _global/
  - _constants.pcss
- _text/
  - a.pcss
- .some-container/
  - div.widget.pcss
- html/
  - body/
    - main/
      - _headings/
        - h1.pcss
        - h2.pcss
        - h3,h4.pcss
      - !table.pcss
      - p.pcss
    - &.pcss

With results like:

```css
a {}
.some-container > div.widget {}
html > body {}
html > body > main table {}
html > body > main > p {}
html > body > main > h1 {}
html > body > main > h2 {}
html > body > main > h3, html > body > main > h4 {}
```

Rules:

- CSS files should start with `&` selector (for using selector, based on their path).
- Path to file (with file name) used to build the selector.
- Directories starts with `_` used only for special grouping and their name is not used in the selector.
- Files starts with `_` are skipped.
- Files and directories starts with `!` joined using descendant combinator, other joined using child combinator.

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

gulp.task(
	'default',
	function ()
	{
		gulp.src( './styles/src/**/*.pcss' )
			.pipe( cssNdb() )
			.pipe( concat( 'common.css' ) )
			// Some processing (PostCSS, LESS, SCSS or any other with nesting and &)
			.pipe( gulp.dest( './styles/' ) );
	}
);
```
