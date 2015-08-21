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
				if ( isDomEntry( data ) )
				{
					data.contents = new Buffer(
						getParentSelector( data ) + '\n{\n'
						+ String( data.contents )
						+ '\n}\n'
					);
				}
				
				callback( null, data );
			}
		}
	);
	
	function isDomEntry( data )
	{
		return /^(?:\d+_)?html/.test(
			data.path.substr( data.base.length ).split( '/' )[0]
		);
	}
	
	function getParentSelector( data )
	{
		var selector;
		
		selector = '';
		
		data.path.substr( data.base.length )
			.split( '/' )
			.slice( 0, -1 )
			.forEach(
				function ( dir, index )
				{
					if ( index === 0 )
					{
						selector += dir.replace( /^\d+_/, '' );
					}
					else
					{
						if ( isDescendantSelector( dir ) )
						{
							selector += dir.substr( 1 );
						}
						else
						{
							selector += '> ' + dir;
						}
					}
				}
			);
		
		return selector;
	}
	
	function isDescendantSelector( name )
	{
		return name.charAt( 0 ) === '!';
	}
};
