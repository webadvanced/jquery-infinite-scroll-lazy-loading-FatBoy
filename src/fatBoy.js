/*! fatBoy v0.5.0 https://github.com/webadvanced/jquery-infinite-scroll-lazy-loading-FatBoy/blob/master/LICENSE */
/*global window: false */
/*global document: false */

;(function( $, w, d, undefined ) {
    //Ensure jQuery is loaded before the plugin
    if( $ === undefined ) throw 'jQuery is required. Please make sure you include a reference to jQuery and that this script is included below it.';

    var pluginName = 'fatBoy',
        pluginGetterName = 'myFatBoy',
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
            beforeAjax: undefined                       // Gets called before the Ajax call is make, is passed the current ajaxOptions as argument
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
        // If the user is at the bottom of the page and the limit has not been reached
        if( this.canProcess && 
            atBottom( this.options.threshold ) && 
            ( this.hasNoLimit  || this.count <= this.options.limit ) ) {
            // Lock on prop to keep from other requests from processing
            this.$el.trigger( this.options.toggleProcessingEvent );
            
            // Trigger event
            this.takeAction();
                     
            // increment count
            this.count++;
            this.options.threshold += 10;
         
            // If the limit has been reached, unbind the scroll event from the container
            if( this.options.limit !== 0 && this.count >= this.options.limit ) {    
                this.diet();
            }
        }
    };

    function FatBoy( el, options ) {
        this.el = el;
        this.$el = $( el );
        this.options = ( options ) ? $.extend( {}, defaults, options ) : defaults;
        this._name = pluginName;        
        this.count = 0;
        this.canProcess = true;
        this.hasNoLimit = ( this.options.limit === 0 );

        // If there are Ajax options, send Ajax request and then trigger eat
        if( this.options.ajaxOptions ) {
            this.options.ajaxOptions.success = $.proxy( this.eat, this );
            this.takeAction = this.bake;
        } else {
            this.takeAction = this.eat;
        }
        
        this.init();

        return this;
    }

    FatBoy.fn = FatBoy.prototype;
    FatBoy.defaults = defaults;
    FatBoy.fn.init = function() {
        this.$el
            .bind( this.options.uiEvent, $.proxy( onAction , this ) ) // Bind the given uiEvent to the onAction function
            .bind( this.options.toggleProcessingEvent, $.proxy( this.eating, this ) ); // Bind the el to the toggle processing event

        // If a callback is provided, bind it to the triggerEvent
        if( this.options.atBottom ) {
            this.atBottom( this.options.atBottom );
        }

        // If limitReached callback is provided
        if( this.options.atLimit ) {
            this.atLimit( this.options.atLimit );
        }
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

    FatBoy.fn.loadMore = function() {
        // Because user is manually calling, toggle processing
        this.$el.trigger( this.options.toggleProcessingEvent );

        this.takeAction();
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
        if( !ajaxOptions ) throw 'ajaxOptions are required';

        ajaxOptions.success = $.proxy( this.eat, this );
        this.options.ajaxOptions = ajaxOptions;
        
        if( beforeAjaxCallback ) this.options.beforeAjax = beforeAjaxCallback;

        this.takeAction = this.bake;

        return this;
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

    $.fn[pluginName] = function ( options ) {
        
        return this.each( function () {
            // Only allow a single instance of FatBoy per el
            if ( !$.data( this, 'plugin_' + pluginName ) ) {
                $.data( this, 'plugin_' + pluginName, new FatBoy( this, options ) );
            }

        });
    };

    $.fn[pluginGetterName] = function() {
        return this.data( 'plugin_' + pluginName );
    };

})( window.jQuery, window, document );