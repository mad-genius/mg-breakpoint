# MG Breakpoint

MG Breakpoint gives you an easy way to run JavaScript code at different breakpoints. It uses CSS Media Queries by way of the built-in `window.matchMedia()` function and custom events.

## Usage

First, you need to create a new instance:

```js
var breakpoints = new MGBreakpoint();
```

By default, MG Breakpoint includes [these 100% correct breakpoint sizes](https://medium.freecodecamp.org/the-100-correct-way-to-do-css-breakpoints-88d6a5ba1862):

```
phone: 0
tabletPortrait: 600
tabletLandscape: 900
desktop: 1200
bigDesktop: 1800
```

You can use _these_ breakpoints or your own—more on that later. Now you can run a function when you enter (or leave) one of these breakpoints.

The `enter` and `leave` functions accept a breakpoint name and a callback function. When the window width enters (or leaves) the given breakpoint, the callback function will fire.

```js
breakpoints.enter('phone', function() {
    // This code will run every time the window goes
    // from 600px to 599px.
});

breakpoints.leave('desktop', function() {
    // This code will run every time the window goes
    // up to 1800px or down to 1199px.
});
```

The callbacks only fire when the current breakpoint changes—not on every resize event. MG Breakpoint keeps up with the changes for you and lets you run code once a specified change happens.

### Native events

Behind the scenes, MG Breakpoint dispatches custom events on the window. If you want, you can manually add listeners to these events. For example, you could rewrite the above functions with jQuery like this:

```js
$(window).on('phoneenter', function() {
    // This code will run every time the window goes
    // from 600px to 599px.
});

$(window).on('desktopleave', function() {
    // This code will run every time the window goes
    // up to 1800px or down to 1199px.
});
```

Note that the custom events are all lowercase.

## Helpers

 In addition to the events system, you have access to some helper functions.

### min

```js
// returns true if (min-width: 600px), otherwise returns false.
breakpoints.min('tabletPortrait');

// You can go ahead and run a function on true if you want
breakpoints.min('tabletPortrait', function() {
    // This code runs if (min-width: 600px)
});
```

### max

```js
// returns true if (max-width: 599px), otherwise returns false.
breakpoints.max('tabletPortrait');

// You can go ahead and run a function on true if you want
breakpoints.max('tabletPortrait', function() {
    // This code runs if (max-width: 599px)
});
```

### minmax

This helper lets you test for a specific breakpoint range.

```js
// returns true if (min-width: 600px) and (max-width: 1199px),
// otherwise returns false.
breakpoints.minmax('tabletPortrait', 'desktop');

// You can go ahead and run a function on true if you want
breakpoints.minmax('tabletPortrait', 'desktop', function() {
    // This code runs if (min-width: 600px) and (max-width: 1199px)
});
```

### getCurrentBreakpoint

This helper will return the current breakpoint as defined by `min-width`.

```js
var currentBP = breakpoints.getCurrentBreakpoint();

console.log(currentBP);
```

If the window was currently 1400px wide, then this would result in the following object being logged:

```js
{
    name: 'desktop',
    value: 1200
}
```

## Custom breakpoints

`MGBreakpoint` accepts two optional arguments in its constructor:

**points**: an object representing breakpoints in terms of `min-width`

**clean**: a boolean to denote whether you want to clear out the default sizes

Let's say you like the defaults but you just need to add one more specific size, you can do:

```js
var breakpoints = new MGBreakpoint({
    yuge: 2400
});
```

This will keep the defaults and just add this new breakpoint to the mix.

You can also modify any of the default sizes. So you could do:

```js
var breakpoints = new MGBreakpoint({
    bigDesktop: 1500,
    yuge: 2400
});
```

This would both modify `bigDesktop` and add `yuge`—and keep the other defaults intact.

But maybe you have your own breakpoints and you want to scrap the defaults. In that case, pass true as the second argument:

```js
var breakpoints = new MGBreakpoint({
    hobbit: 400,
    dwarf: 700,
    human: 960,
    troll: 2200
}, true); // passing true as second argument
```

This will throw out the defaults and only use the breakpoints you pass in.