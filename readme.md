#fat boy ~#

##What and Why##
fatBoy is a jQuery plugin that will help with infinite scrolling and lazy loading. Using it allows you to bind callback functions to fire when the user reaches the bottom of your page and more!


##Using it##
```javascript
$(function() {
	// Call fatBoy on window and pass in an options object
	$( window ).fatBoy({ callback: function() {
		alert( 'bottom of page!' );
	}});

	// or

	// By passing true as the artument, an instance of FatBoy is returned in place of jQuery
	// We can now chain methods like atBottom and atLimit
	$( window ).fatBoy( true )
		.atBottom( function() {
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
beforeAjax: undefined      // Gets called before the Ajax call is made, passes the current ajaxOptions as argument
returnFatboy: false        // If true, $( el ).fatBoy() will return an instance of FatBoy not jQuery
```

##Registering callbacks##

Registering callbacks can be done a couple of ways:

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

**Passing an options object as the argument to fatBoy**

```javascript
$( window ).fatBoy( { atBottom: callMeWhenUserReachesTheBottomOfPageOne, atLimit: callMeWhenLimitIsReached } );

//this is limited because you can only register a single callback for each
```

**Chaining callback functions**

```javascript
// Get a reference to the instance of FatBoy by passing true or setting the { returnFatBoy: true } in options
// Now you can call the atBottom and atLimit functions on the returned FatBoy instance to register callbacks
$( window ).fatBoy( true )
           .atBottom( callMeWhenUserReachesTheBottomOfPageOne )
           .atBottom( callMeWhenUserReachesTheBottomOfPageTwo )
           .atLimit( callMeWhenLimitIsReached );

// This allows for multiple callbacks to be registered
```


##Setting default options##

You can use the `$.fatBoy.options` hash to set default options that will be applied to every call to fatBoy()

```javascript
$.fatBoy.options = {
	limit: 5, // auto load only 5x
	threshold: 250 //account for footer,
	returnFatBoy: true
};
```

Now, calling `$( el ).fatBoy()` will use those defaults. If you pass arguments to the fatBoy call, they will take priority.


**Twitter sample** 

https://github.com/webadvanced/jquery-infinite-scroll-lazy-loading-FatBoy/blob/master/playground/sample.html