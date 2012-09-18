#fat boy ~#

##What and Why##
fatBoy is a jQuery plugin that will help with infinite scrolling and lazy loading. Using it allows you to bind callbacks functions to fire when the user reaches the bottom of your page.

##Options and defaults##

```javascript
limit: 3,                             // Number of times to fire event
limitReached: _undefined,             // Called when limit is reached
limitReachedEvent: 'limitReached',    // Event that will be triggered when limit is reached
threshold: 25,                        // Number of px up from the bottom of the page
triggerEvent: 'nextPage',             // Event that jQuery will trigger when user reaches the bottom of the page
uiEvent: 'scroll',                    // User event to trigger plugin
callback: _undefined                 // Callback function to be executed when user reaches the bottom of the page
```
##using it##
```javascript
$(function() {
	$( window ).fatBoy({ callback: function() {
		alert( 'bottom of page!' );
	}});
});
```