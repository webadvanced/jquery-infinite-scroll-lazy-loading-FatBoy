/*global window: false */
/*global document: false */

;(function( $, w, d, undefined ) {
    //Ensure jQuery is loaded before the plugin
    if( $ === undefined ) throw 'jQuery is required. Please make sure you include a reference to jQuery and that this script is included below it.';

    var pluginName = 'fatBoy',
        pluginGetterName = 'myFatBoy',
        defaults = {
            limit: 3,                             // Number of times to fire event (0 === unlimited)
            threshold: 25,                        // Number of px up from the bottom of the page
            triggerEvent: 'fatboy:eat',           // Event that jQuery will trigger when user reaches the bottom of the page
            uiEvent: 'scroll',                    // UI event to trigger plugin
            callback: undefined,                  // Callback function to be executed when user reaches the bottom of the page
            limitReached: undefined,              // Callback function to be executed when limit is reached
            limitReachedEvent: 'fatboy:alldone'   // Event that jQuery will trigger when limit is reached
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
            ( this.options.limit === 0 || this.count < this.options.limit ) ) {
            // Lock on prop to keep from other requests from processing
            this.canProcess = false;
            
            // Trigger event
            this.eat();
         
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

        this.init();

        return this;
    }

    FatBoy.fn = FatBoy.prototype;
    FatBoy.defaults = defaults;
    FatBoy.fn.init = function() {
        
        // Bind the given uiEvent to the onAction function
        this.$el.bind( this.options.uiEvent, $.proxy( onAction , this ) );
        
        // If a callback is provided, bind it to the triggerEvent
        if( this.options.callback ) {
            this.$el.atBottom( this.options.callback );
        }

        // If limitReached callback is provided
        if( this.options.limitReached ) {
            this.$el.atLimit( this.options.limitReached );
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

    FatBoy.fn.eat = function() {
        this.$el.trigger( this.options.triggerEvent );
        
        // Release the lock so FatBoy and process more requests
        this.canProcess = true;

        return this;
    };

    FatBoy.fn.diet = function() {
        // Unbind all the atBottom callback functions from the uiEvent
        this.$el.unbind( this.options.uiEvent );

        // Trigger all atLimit callbacks
        this.$el.trigger( this.options.limitReachedEvent );
    };

    $.fn[pluginName] = function ( options ) {
        
        return this.each( function () {
            
            if ( !$.data( this, 'plugin_' + pluginName ) ) {
                $.data( this, 'plugin_' + pluginName, new FatBoy( this, options ) );
            }

        });
    };

    $.fn[pluginGetterName] = function() {
        return this.data( 'plugin_' + pluginName );
    };

})( window.jQuery, window, document );