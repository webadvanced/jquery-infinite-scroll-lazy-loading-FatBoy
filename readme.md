#fat boy ~#

##What and Why##
fatBoy is a jQuery plugin that will help with infinite scrolling and lazy loading. Using it allows you to bind callbacks functions to fire when the user reaches the bottom of your page.

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
##Using it##
```javascript
$(function() {
	$( window ).fatBoy({ callback: function() {
		alert( 'bottom of page!' );
	}});
});
```

check out the sample for more: https://github.com/webadvanced/Fat-Boy-jQuery-Lazy-Loading/blob/master/playground/sample.html