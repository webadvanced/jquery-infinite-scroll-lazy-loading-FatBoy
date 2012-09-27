#fat boy ~#

##What and Why##
fatBoy is a jQuery plugin that will help with infinite scrolling and lazy loading. Using it allows you to bind callbacks functions to fire when the user reaches the bottom of your page and more!


##Using it##
```javascript
$(function() {
	$( window ).fatBoy({ callback: function() {
		alert( 'bottom of page!' );
	}});

	// or

	// Get a reference to the FatBoy reference using the myFatBoy extension method and then call the atBottom function
	var fatBoy = $( window ).fatBoy().myFatBoy();

	fatBoy.atBottom( function() {
		alert( 'bottom of page!' );
	});

});
```


##Options and defaults ( $.fatBoy.defaults )##

```javascript
limit: 3                   // Number of times to fire event (0 === unlimited)
threshold: 25              // Number of px up from the bottom of the page
uiEvent: 'scroll'          // UI event to trigger plugin
atBottom: undefined        // Callback function to be executed when user reaches the bottom of the page
atLimit: undefined         // Callback function to be executed when limit is reached
ajaxOptions: undefined     // jQuery Ajax options
beforeAjax: undefined      // Gets called before the Ajax call is make, is passed the current ajaxOptions as argument
returnFatboy: false        // If true, $( el ).fatBoy() will return an instance if FatBoy not jQuery
```

##Registering callbacks##

Registering callbacks when the user reaches the bottom of the page and when the limit has been reached can be done 1 of 3 ways:

```javascript
// The callback functions
var callMeWhenUserReachesTheBottomOfPageOne = function() {
	alert( 'The bottom!' );
};

var callMeWhenUserReachesTheBottomOfPageTwo = function() {
	alert( 'The bottom, again!' );
};

var callMeWhenLimitIsReached = function() {
	alert( 'Done calling functions when user hits bottom of page.' );
};
```

**Using the argument object and setting the callback and limitReached properties**

```javascript
$( window ).fatBoy( { callback: callMeWhenUserReachesTheBottomOfPageOne, limitReached: callMeWhenLimitIsReached } );

//this is limited because you can only register a single callback
```

**Chaining with the atBottom and atLimit register functions**

```javascript
// Get a reference to the FatBoy reference by passing true or setting the { returnFatBoy: true } in options
// Then we can call the atBottom and atLimit functions on the returned FatBoy instance to register callbacks
$( window ).fatBoy( true )
           .atBottom( callMeWhenUserReachesTheBottomOfPageOne )
           .atBottom( callMeWhenUserReachesTheBottomOfPageTwo )
           .atLimit( callMeWhenLimitIsReached );

// This allows for multiple callbacks to be registered when the 
// user hits the bottom of the page and when the atBottom limit has been reached
```

check out out Twitter sample: https://github.com/webadvanced/jquery-infinite-scroll-lazy-loading-FatBoy/blob/master/playground/sample.html