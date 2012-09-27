/*! fatBoy v0.5.0 https://github.com/webadvanced/jquery-infinite-scroll-lazy-loading-FatBoy/blob/master/LICENSE */
/*global window: false */
/*global document: false */

;(function( $, w, d, undefined ) {
    //Ensure jQuery is loaded before the plugin
    if( $ === undefined ) throw 'jQuery is required. Please make sure you include a reference to jQuery and that this script is included below it.';

    var pluginName = 'fatBoy',
        pluginGetterName = 'getFatboy',
        initFatBoy,
        initJQuery,
        defaults = {
            limit: 3,                                   // Number of times to fire event (0 === unlimited)
            threshold: 25,                              // Number of px up from the bottom of the page
            triggerEvent: 'fatboy:eat',                 // Event that jQuery will trigger when user reaches the bottom of the page
            uiEvent: 'scroll',                          // UI event to trigger plugin
            atBottom: undefined,                        // Callback function to be executed when user reaches the bottom of the page
            atLimit: undefined,                         // Callback function to be executed when limit is reached
            limitReachedEvent: 'fatboy:diet',           // Event that jQuery will trigger when limit is reached
            toggleProcessingEvent: 'fatboy:eating',     // Event that jQuery will trigger when processing starts and stops
            ajaxOptions: undefined,                     // jQuery Ajax options
            beforeAjax: undefined,                      // Gets called before the Ajax call is made, passes the current ajaxOptions as argument
            returnFatboy: false                         // If true, $( el ).fatBoy() will return an instance of FatBoy not jQuery
        }, 
        atBottom,
        onAction,
        $window = $( w ),
        $document = $( d );
    
    atBottom = function( threshold ) {
        // Check if the user has reached the bottom on the document ( as best we can )
        return ( ( $window.scrollTop() + threshold ) >= ( $document.height() - $window.height() ) );
    };

    onAction = function() {
        var _fatBoy = this;
        // If the user is at the bottom of the page and the limit has not been reached
        if( _fatBoy.canProcess && 
            atBottom( _fatBoy.options.threshold ) && 
            ( _fatBoy.hasNoLimit  || _fatBoy.count <= _fatBoy.options.limit ) ) {
            // Lock on prop to keep from other requests from processing
            _fatBoy.$el.trigger( _fatBoy.options.toggleProcessingEvent );
            
            // Trigger event
            _fatBoy.takeAction();
                     
            // increment count
            _fatBoy.count++;
            _fatBoy.options.threshold += 10;
         
            // If the limit has been reached, unbind the scroll event from the container
            if( _fatBoy.options.limit !== 0 && _fatBoy.count >= _fatBoy.options.limit ) {    
                _fatBoy.diet();
            }
        }
    };

    function FatBoy( el, options ) {
        var _fatBoy = this;
        _fatBoy.el = el;
        _fatBoy.$el = $( el );
        _fatBoy.options = ( options ) ? $.extend( {}, defaults, options ) : defaults;
        _fatBoy._name = pluginName;        
        _fatBoy.count = 0;
        _fatBoy.canProcess = true;
        _fatBoy.hasNoLimit = ( _fatBoy.options.limit === 0 );

        // If there are Ajax options, send Ajax request and then trigger eat
        if( _fatBoy.options.ajaxOptions ) {
            _fatBoy.setAjaxOptions( _fatBoy.options.ajaxOptions, _fatBoy.options.beforeAjax );
        } else {
            _fatBoy.takeAction = _fatBoy.eat;
        }
        
        _fatBoy.init();

        return _fatBoy;
    }

    FatBoy.fn = FatBoy.prototype;
    FatBoy.defaults = defaults;
    FatBoy.fn.init = function() {
        var _fatBoy = this;
        _fatBoy.$el
            .bind( _fatBoy.options.uiEvent, $.proxy( onAction , _fatBoy ) ) // Bind the given uiEvent to the onAction function
            .bind( _fatBoy.options.toggleProcessingEvent, $.proxy( _fatBoy.eating, _fatBoy ) ); // Bind the el to the toggle processing event

        // If a callback is provided, bind it to the triggerEvent
        if( _fatBoy.options.atBottom ) {
            _fatBoy.atBottom( _fatBoy.options.atBottom );
        }

        // If limitReached callback is provided
        if( _fatBoy.options.atLimit ) {
            _fatBoy.atLimit( _fatBoy.options.atLimit );
        }

        //set up a load more function that will keep the scope of the FatBoy instance
        _fatBoy.loadMore = function() {
            // Because user is manually calling, toggle processing
            _fatBoy.$el.trigger( _fatBoy.options.toggleProcessingEvent );
            _fatBoy.takeAction();
            return _fatBoy;
        };
    };

    // Bind callbacks that will fire when the user reaches the bottom of the page
    // If no callback is supplied, it will fire all callbacks that were bound
    FatBoy.fn.atBottom = function( callback ) {
        if( callback ) {
            this.$el.bind( this.options.triggerEvent, $.proxy( callback, this ) );    
        } else {
            this.eat();
        }
        
        return this;
    };

    // Bind callbacks to fire when the limit has been reached.
    FatBoy.fn.atLimit = function( callback ) {
        if( callback ) {
            this.$el.bind( this.options.limitReachedEvent, $.proxy( callback, this ) );
        }
        
        return this;
    };

    FatBoy.fn.eat = function( response ) {
        this.$el.trigger( this.options.triggerEvent, response );
        
        // Release the lock so FatBoy and process more requests
        this.$el.trigger( this.options.toggleProcessingEvent );

        return this;
    };

    FatBoy.fn.bake = function() {
        if( this.options.beforeAjax ) {
            this.options.beforeAjax( this.options.ajaxOptions ); 
        }
        
        $.ajax( this.options.ajaxOptions );

        return this;
    };

    FatBoy.fn.setAjaxOptions = function( ajaxOptions, beforeAjaxCallback ) {
        var _fatBoy = this;
        if( !ajaxOptions ) throw 'ajaxOptions are required';

        ajaxOptions.success = $.proxy( _fatBoy.eat, _fatBoy );
        _fatBoy.options.ajaxOptions = ajaxOptions;
        
        if( beforeAjaxCallback ) _fatBoy.options.beforeAjax = beforeAjaxCallback;

        _fatBoy.takeAction = _fatBoy.bake;

        return _fatBoy;
    };

    FatBoy.fn.eating = function() {
        this.canProcess = !this.canProcess;

        return this;
    };

    FatBoy.fn.diet = function() {
        // Unbind all the atBottom callback functions from the uiEvent
        this.$el.unbind( this.options.uiEvent );

        // Trigger all atLimit callbacks
        this.$el.trigger( this.options.limitReachedEvent );

        return this;
    };

    // Allows users to get the instance of FatBoy for an el $( el ).getFatBoy()
    $.fn[pluginGetterName] = function() {
        return this.data( 'plugin_' + pluginName );
    };

    $.fn[pluginName] = function ( options, init ) {
        
        init = init || ( options === true || ( options && options.returnFatBoy ) ) ? initFatBoy : initJQuery;

        if( this.length > 1 ) {
            this.each(function() {
                $( this ).fatBoy( options, init );
            });
        }

        return init( options );
    };

    initJQuery = function( options, fatBoy ) {
        fatBoy = fatBoy || new FatBoy( this, options );
        if ( !$.data( this, 'plugin_' + pluginName ) ) {
            $.data( this, 'plugin_' + pluginName, fatBoy );
        }
        return $( this );
    };

    initFatBoy = function( options ) {
        var fatBoy = new FatBoy( this, options );
        initJQuery( this, fatBoy );
        return fatBoy;
    };

    // Expose the defaults
    $.fatBoy.defaults = defaults;

})( window.jQuery, window, document );