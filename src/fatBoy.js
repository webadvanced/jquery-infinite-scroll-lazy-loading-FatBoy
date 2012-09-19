(function( $, w, d, _undefined ) {
	if( $ === _undefined ) throw 'jQuery is required. Please make sure you include a reference to jQuery and that this script is included below it.';

	var defaults = {
		limit: 3,                             // Number of times to fire event (0 === unlimited)
		threshold: 25,                        // Number of px up from the bottom of the page
		triggerEvent: 'fatboy:eat',           // Event that jQuery will trigger when user reaches the bottom of the page
		uiEvent: 'scroll',                    // UI event to trigger plugin
		callback: _undefined,                 // Callback function to be executed when user reaches the bottom of the page
		limitReached: _undefined,             // Callback function to be executed when limit is reached
		limitReachedEvent: 'fatboy:alldone'   // Event that jQuery will trigger when limit is reached
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
		$container.options = options;
		
		$container.atBottom = function( callback ) {
			$container.bind( options.triggerEvent, callback );
			return this;
		};

		$container.atLimit = function( callback ) {
			$container.bind( options.limitReachedEvent, callback );
			return this;
		};
		

		$container.bind( options.uiEvent, function() {
			// If the user is at the bottom of the page and the limit has not been reached
			if( atBottom( options.threshold ) && ( options.limit === 0 || count < options.limit ) ) {
				// trigger event
				$container.trigger( options.triggerEvent );
				// increment count
				count++;
				options.threshold += 10;
				// If the limit has been reached, unbind the scroll event from the container
				if( options.limit !== 0 && count >= options.limit ) {	
					$container.unbind( options.uiEvent );
					$container.trigger( options.limitReachedEvent );
				}
			}
		});
		// If a callback is provided, bind it to the triggerEvent
		if( options.callback ) {
			$container.atBottom( options.callback );
		}

		// If limitReached callback is provided
		if( options.limitReached ) {
			$container.atLimit( options.limitReached );
		}

		return this;
	};

})( window.jQuery, window, document );