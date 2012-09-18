(function( $, w, d, _undefined ) {
	if( $ === _undefined ) throw 'jQuery is required. Please make sure you include a reference to jQuery and that this script is included below it.';

	var defaults {
		limit: 3,
		threshold: 100, //px
		triggerEvent: 'nextPage',
		uiEvent: 'scroll',
		callback: _undefined
	}, 
		atBottom,
		$window = $( w ),
		$document = $( d );
	
	atBottom = function( threshold ) {
		return ( ( $window.scrollTop() + threshold ) >= $document.height() - $window.height() );
	};

	$.fn.fatBoy = function( options, callback ) {
		
		options = $.extend( {}, defaults, options );

		var $container = this,
			count = 0;

		$contaier.bind( options.uiEvent, function() {
			//If the user is at the bottom of the page and the limit has not been reached
			if( atBottom( options.threshold ) && ( options.limit === 0 || count < options.limit ) ) {
				//trigger event
				$contaier.trigger( options.triggerEvent );
				//incrament count
				count++;

				//If the limit has been reach, unbind the scrool event from the container
				if( options.limit != 0 && count >= options.limit ) {	
					$contaier.unbind( options.uiEvent );
				}
			}
		});
		//If a callback is provided, bind it to the triggerEvent
		if( options.callback ) {
			$contaier.bind( options.triggerEvent, options.callback );
		}
	};

})( window.jQuery, window, document );