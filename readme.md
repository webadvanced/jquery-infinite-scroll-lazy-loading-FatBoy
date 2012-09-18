#fat boy ~#

##What and Why##
fatBoy is a jQuery plugin that will help with infinite scrolling and lazy loading. Using it allows you to bind callbacks functions to fire when the user reaches the bottom of your page.

##Options and defaults##

```javascript
limit: 3,                   // Number of times to fire event
threshold: 25,              // Number of px up from the bottom of the page
triggerEvent: 'nextPage',   // Event that jQuery will trigger when user reaches the bottom of the page
uiEvent: 'scroll',          // User event to trigger plugin
callback: _undefined,       // Callback function to be executed when user reaches the bottom of the page
limitReached: _undefined    // Function called when limit is reached
```
##using it##
```javascript
$(function() {
	$( window ).fatBoy({ callback: function() {
		alert( 'bottom of page!' );
	}});
});
```