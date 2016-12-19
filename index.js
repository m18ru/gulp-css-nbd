var gulpUtil = require( 'gulp-util' );
var through2 = require( 'through2' );

/**
 * CSS nesting by directory gulp plugin
 */
module.exports = function ()
{
	return through2.obj(
		function ( data, encoding, callback )
		{
			if ( data.isNull() )
			{
				callback( null, data );
				return;
			}
			
			if ( data.isStream() )
			{
				this.emit(
					'error',
					new gulpUtil.PluginError(
						'gulp-css-nbd',
						'Streams are not supported!'
					)
				);
				callback();
				return;
			}
			
			if ( data.isBuffer() )
			{
				if ( isSkipFile( data ) )
				{
					callback();
					return;
				}
				
				data.contents = new Buffer(
					getPathSelector( data ) + '\n{\n'
					+ String( data.contents )
					+ '\n}\n'
				);
				
				callback( null, data );
			}
		}
	);
};

/**
 * Checks whether the file should be skipped
 * 
 * @param data Through2 file data
 * @returns Skip file?
 */
function isSkipFile( data )
{
	return /\/_[^\/]*$/.test( data.path );
}

/**
 * Build CSS selector based on file path
 * 
 * @param data Through2 file data
 * @returns CSS selector
 */
function getPathSelector( data )
{
	var selectors = [''];
	var firstEntry = true;
	
	pathWithoutExtension( data.path )
		.substr( data.base.length )
		.split( '/' )
		.forEach(
			function ( name )
			{
				if ( isNotForSelector( name ) )
				{
					return;
				}
				
				var descendant = isDescendantSelector( name );
				var modifier = isModifier( name );
				var combinator = (
					(
						modifier
						|| ( selectors[0].length === 0 )
					)
					? ''
					: ( descendant ? ' ' : ' > ' )
				);
				var parts = splitSelectors( name );
				var currentSelectors = selectors.slice();
				
				for ( var i = 0, n = parts.length; i < n; i++ )
				{
					var selector = combinator
						+ (
							( descendant || modifier )
							? parts[i].substr( 1 )
							: parts[i]
						);
					
					if ( i > 0 )
					{
						selectors = selectors.concat(
							appendToStrings( currentSelectors.slice(), selector )
						);
					}
					else
					{
						appendToStrings( selectors, selector );
					}
				}
			}
		);
	
	return selectors.join( ', ' );
}

/**
 * Append given string to every string in array (mutates original array)
 * 
 * @param strings Array of strings
 * @param addition String to append
 * @returns Array of strings
 */
function appendToStrings( strings, addition )
{
	for ( var i = 0, n = strings.length; i < n; i++ )
	{
		strings[i] += addition;
	}
	
	return strings;
}

/**
 * Split string of selectors separated by comma
 * 
 * @param selectors String of selectors
 * @returns Array of selectors
 */
function splitSelectors( selectors )
{
	var parts = [];
	var inParentheses = false;
	var lastPos = 0;
	
	for ( var i = 0, n = selectors.length; i < n; i++ )
	{
		if ( inParentheses )
		{
			if ( selectors[i] === ')' )
			{
				inParentheses = false;
			}
		}
		else if ( selectors[i] === '(' )
		{
			inParentheses = true;
		}
		else if ( selectors[i] === ',' )
		{
			parts.push( selectors.slice( lastPos, i ) );
			lastPos = i + 1;
		}
	}
	
	parts.push( selectors.slice( lastPos ) );
	
	return parts;
}

/**
 * Returns path without file extension
 * 
 * @param path File path
 * @returns Path without extension
 */
function pathWithoutExtension( path )
{
	return path.replace( /\.\w+$/, '' );
}

/**
 * Checks whether it is descendant selector
 * 
 * @param name File or directory name
 * @returns Descendant selector?
 */
function isDescendantSelector( name )
{
	return ( name.charAt( 0 ) === '!' );
}

/**
 * Checks whether it is modifier of selector
 * 
 * @param name File or directory name
 * @returns Modifier of selector?
 */
function isModifier( name )
{
	return ( name.charAt( 0 ) === '&' );
}

/**
 * Checks that it should not be a part of the selector
 * 
 * @param name File or directory name
 * @returns Skip from selector?
 */
function isNotForSelector( name )
{
	return (
		// Partial
		( name.charAt( 0 ) === '_' )
		// Same selector
		|| ( name === '&' )
	);
}
