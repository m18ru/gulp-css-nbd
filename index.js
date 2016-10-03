var gulpUtil = require( 'gulp-util' );
var through2 = require( 'through2' );

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
					new gulpUtil.PluginError( 'gulp-css-nbd', 'Streams are not supported!' )
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
					getParentSelector( data ) + '\n{\n'
					+ String( data.contents )
					+ '\n}\n'
				);
				
				callback( null, data );
			}
		}
	);
	
	function isSkipFile( data )
	{
		return /\/_[^\/]*$/.test( data.path );
	}
	
	function getParentSelector( data )
	{
		var selector = '';
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
					
					if ( firstEntry )
					{
						if ( isDescendantSelector( name ) )
						{
							selector = name.substr( 1 );
						}
						else
						{
							selector = name;
						}
					}
					else if ( isDescendantSelector( name ) )
					{
						selector += ' ' + name.substr( 1 );
					}
					else
					{
						selector += ' > ' + name;
					}
					
					firstEntry = false;
				}
			);
		
		return selector;
	}
	
	function pathWithoutExtension( path )
	{
		return path.replace( /\.\w+$/, '' );
	}
	
	function isDescendantSelector( name )
	{
		return name.charAt( 0 ) === '!';
	}
	
	function isNotForSelector( name )
	{
		return (
			( name.charAt( 0 ) === '_' )
			|| ( name.indexOf( '&' ) !== -1 )
		);
	}
};
