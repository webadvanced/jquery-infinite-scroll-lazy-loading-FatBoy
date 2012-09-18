(function( $, w, d, _undefined ) {
	if( $ === _undefined ) throw 'jQuery is required. Please make sure you include a reference to jQuery and that this script is included below it.';

	var defaults = {
		limit: 3,                             // Number of times to fire event
		threshold: 25,                        // Number of px up from the bottom of the page
		triggerEvent: 'fatboy:eat',           // Event that jQuery will trigger when user reaches the bottom of the page
		uiEvent: 'scroll',                    // User event to trigger plugin
		callback: _undefined,                 // Callback function to be executed when user reaches the bottom of the page
		limitReached: _undefined,             // Called when limit is reached
		limitReachedEvent: 'fatboy:alldone'   // Called when limit is reached
	}, 
		atBottom,
		$window = $( w ),
		$document = $( d );
	
	atBottom = function( threshold ) {
		return ( ( $window.scrollTop() + threshold ) >= ( $document.height() - $window.height() ) );
	};

	$.fn.fatBoy = function( options, callback ) {
		
		options = $.extend( {}, defaults, options );

		var $container = this,
			count = 0;

		$container.bind( options.uiEvent, function() {
			//If the user is at the bottom of the page and the limit has not been reached
			if( atBottom( options.threshold ) && ( options.limit === 0 || count < options.limit ) ) {
				//trigger event
				$container.trigger( options.triggerEvent );
				//incrament count
				count++;
				options.threshold += 10;
				//If the limit has been reach, unbind the scrool event from the container
				if( options.limit !== 0 && count >= options.limit ) {	
					$container.unbind( options.uiEvent );
					$container.trigger( options.limitReachedEvent );
				}
			}
		});
		//If a callback is provided, bind it to the triggerEvent
		if( options.callback ) {
			$container.bind( options.triggerEvent, options.callback );
		}

		//If limitReached callback is provided
		if( options.limitReached ) {
			$container.bind( options.limitReachedEvent, options.limitReached );
		}

		return this;
	};

})( window.jQuery, window, document );