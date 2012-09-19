#fat boy ~#

##What and Why##
fatBoy is a jQuery plugin that will help with infinite scrolling and lazy loading. Using it allows you to bind callbacks functions to fire when the user reaches the bottom of your page.


##Using it##
```javascript
$(function() {
	$( window ).fatBoy({ callback: function() {
		alert( 'bottom of page!' );
	}});

	// or

	$( window ).fatBoy().atBottom( function() {
		alert( 'bottom of page!' );
	});

});
```


##Options and defaults##

```javascript
limit: 3,                             // Number of times to fire event (0 === unlimited)
threshold: 25,                        // Number of px up from the bottom of the page
triggerEvent: 'fatboy:eat',           // Event that jQuery will trigger when user reaches the bottom of the page
uiEvent: 'scroll',                    // UI event to trigger plugin
callback: _undefined,                 // Callback function to be executed when user reaches the bottom of the page
limitReached: _undefined,             // Callback function to be executed when limit is reached
limitReachedEvent: 'fatboy:alldone'   // Event that jQuery will trigger when limit is reached
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

**Using the argument object and setting the callback property**

```javascript
$( window ).fatBoy( { callback: callMeWhenUserReachesTheBottomOfPageOne, limitReached: callMeWhenLimitIsReached } );

//this is limited because you can only register a single callback
```

**Chaining with the atBottom register function**

```javascript
$( window ).fatBoy()
           .atBottom( callMeWhenUserReachesTheBottomOfPageOne )
           .atBottom( callMeWhenUserReachesTheBottomOfPageTwo )
           .atLimit( callMeWhenLimitIsReached );

//both functions will fire when the user hits the bottom of the page
```

**Using jQuery bind**

```javascript
$( window ).fatBoy()
           .bind( 'fatboy:eat', callMeWhenUserReachesTheBottomOfPageOne )
           .bind( 'fatboy:eat', callMeWhenUserReachesTheBottomOfPageTwo )
           .bind( 'fatboy:alldone', callMeWhenLimitIsReached );

//both functions will fire when the user hits the bottom of the page
```

check out the sample for more: https://github.com/webadvanced/Fat-Boy-jQuery-Lazy-Loading/blob/master/playground/sample.html