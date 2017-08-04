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

### Responding to breakpoints

The following functions accept a breakpoint name and a callback function. When the window width enters (or leaves) the given breakpoint, the callback function will fire.

#### `min` and `max`

Use `min` to fire a function once _on the way up_ and use `max` to fire a function once _on the way down_.

```js
breakpoints.min('tabletPortrait', function() {
    // This code will run every time the window goes
    // from 599px to 600px.
});

breakpoints.max('tabletPortrait', function() {
    // This code will run every time the window goes
    // from 600px to 599px.
});
```

Use `enter` to fire a function once when entering a particular breakpoint range, regardless of the direction you are entering from.

```js
breakpoints.enter('tabletPortrait', function() {
    // This code will run every time the window goes
    // up to 600px or down to 899px.
});
```

Use `leave` to fire a function once when leaving a particular breakpoint range, regardless of the direction you are leaving from.

```js
breakpoints.leave('desktop', function() {
    // This code will run every time the window goes
    // up to 1800px or down to 1199px.
});
```

The callbacks only fire when the current breakpoint changes—not on every resize event. MG Breakpoint keeps up with the changes for you and lets you run code once a specified change happens.

### Native events

Behind the scenes, MG Breakpoint dispatches custom events on the window. If you want, you can manually add listeners to these events. For example, you could rewrite the above `min` and `max` functions like this:

```js
window.addEventListener('tabletportraitmin', function() {
    // This code will run every time the window goes
    // from 599px to 600px.
});

window.addEventListener('tabletportraitmax', function() {
    // This code will run every time the window goes
    // from 600px to 599px.
});
```

Or with jQuery:

```js
$(window).on('tabletportraitmin', function() {
    // This code will run every time the window goes
    // from 599px to 600px.
});

$(window).on('tabletportraitmax', function() {
    // This code will run every time the window goes
    // from 600px to 599px.
});
```

Each breakpoint results in four custom events:

- `yourbreakpointmin`
- `yourbreakpointmax`
- `yourbreakpointenter`
- `yourbreakpointleave`

Note that the custom events are all lowercase.

### Body class

MG Breakpoint will also apply a class to the `body`, representing the current breakpoint in terms of min-width, in the format of `mgb-yourbreakpoint`. It will automatically add and remove classes as you resize the window. Note that the breakpoint names are automatically converted to lowercase. If you don't want MG Breakpoint to apply a body class, you can specify that in the options. See "Configuration" below.

## Helpers

 In addition to the events system, you have access to some helper functions.

### isMin

```js
// returns true if (min-width: 600px), otherwise returns false.
breakpoints.isMin('tabletPortrait');

// You can go ahead and run a function on true if you want
breakpoints.isMin('tabletPortrait', function() {
    // This code runs if (min-width: 600px)
});
```

### isMax

```js
// returns true if (max-width: 599px), otherwise returns false.
breakpoints.isMax('tabletPortrait');

// You can go ahead and run a function on true if you want
breakpoints.isMax('tabletPortrait', function() {
    // This code runs if (max-width: 599px)
});
```

### isMinMax

This helper lets you test for a specific breakpoint range.

```js
// returns true if (min-width: 600px) and (max-width: 1199px),
// otherwise returns false.
breakpoints.isMinMax('tabletPortrait', 'desktop');

// You can go ahead and run a function on true if you want
breakpoints.isMinMax('tabletPortrait', 'desktop', function() {
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

## Configuration

`MGBreakpoint` accepts two optional arguments in its constructor:

**points**: an object representing breakpoints in terms of `min-width`

**options**: an object representing configuration options

### Custom breakpoints

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

But maybe you have your own breakpoints and you want to scrap the defaults. In that case, you can override MG Breakpoint's options.

### Options

You can set two options:

**removeDefaultBreakpoints**: determines whether to use only the breakpoints you specify, removing the default breakpoints. Defaults to `false`.

**updateBodyClass**: determines whether to apply a class to the body representing the current breakpoint. Defaults to `true`.

```js
var breakpoints = new MGBreakpoint({
    hobbit: 400,
    dwarf: 700,
    human: 960,
    troll: 2200
}, {
    removeDefaultBreakpoints: true
});
```

This will throw out the defaults and only use the breakpoints you pass in.

### Disabling body class updates

If you don't want MG Breakpoint to apply a body class representing the current breakpoint, do:

```js
var breakpoints = new MGBreakpoint(null, {
    updateBodyClass: false
});
```