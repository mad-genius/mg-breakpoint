function MGBreakpoint(points, clean) {
	this.points = this.mergePoints(points, clean);
	this.lastBreakpoint = this.getCurrentBreakpoint();
	this.events = this.buildEvents();
	this.init();
}

MGBreakpoint.prototype.init = function() {
	var self = this;

	window.addEventListener('resize', function() {
		var current = self.getCurrentBreakpoint();

		// if breakpoint has changed
		if(current.name !== self.lastBreakpoint.name) {
			// dispatch on for current
			window.dispatchEvent(self.events[current.name]['on']);
			// dispatch off for last breakpoint
			window.dispatchEvent(self.events[self.lastBreakpoint.name]['off']);
			// update last breakpoint
			self.lastBreakpoint = current;
		}
	});
};

MGBreakpoint.prototype.mergePoints = function(points, clean) {
	var defaults = {
		phone: 0,
		tabletPortrait: 600,
		tabletLandscape: 900,
		desktop: 1200,
		bigDesktop: 1800
	};
	var pointsArray = [];

	// if clean is true, clear out the defaults
	if(clean) {
		defaults = {};
	}

	// merge passed in points with defaults
	for(var property in points) {
		if(points.hasOwnProperty(property)) {
			defaults[property] = points[property];
		}
	}

	// create an array of breakpoint objects
	for(var property in defaults) {
		if(defaults.hasOwnProperty(property)) {
			pointsArray.push({
				name: property,
				value: defaults[property]
			});
		}
	}

	// sort by breakpoint value
	pointsArray.sort(function(a, b) {
		if(a.value < b.value) {
			return -1;
		} else if(b.value < a.value) {
			return 1;
		} else {
			return 0;
		}
	});

	return pointsArray;
};

MGBreakpoint.prototype.on = function(breakpoint, callback) {
	window.addEventListener(breakpoint.toLowerCase() + 'on', callback);
};

MGBreakpoint.prototype.off = function(breakpoint, callback) {
	window.addEventListener(breakpoint.toLowerCase() + 'off', callback);
};

MGBreakpoint.prototype.min = function(breakpoint, callback) {
	var result = window.matchMedia('(min-width: ' + this.get(breakpoint).value + 'px)').matches;

	if(callback && result) {
		callback();
	}

	return result;
};

MGBreakpoint.prototype.max = function(breakpoint, callback) {	
	var result = window.matchMedia('(max-width: ' + (this.get(breakpoint).value - 1) + 'px)').matches;

	if(callback && result) {
		callback();
	}
	
	return result;
};

MGBreakpoint.prototype.minmax = function(min, max, callback) {
	var result = window.matchMedia('(min-width: ' + this.get(min).value + 'px) and (max-width: ' + (this.get(max).value - 1) + 'px)').matches;

	if(callback && result) {
		callback();
	}
	
	return result;
};

MGBreakpoint.prototype.get = function(breakpoint) {
	var result = this.points.filter(function(point) {
		return point.name === breakpoint;
	});


	return result[0];
};

MGBreakpoint.prototype.getCurrentBreakpoint = function() {
	var points = this.points;

	var current = points.filter(function(point, index) {
		var next = false;
		var query = '';

		if(index < points.length - 1) {
			next = points[index + 1];
		}

		if(next) {
			query = '(min-width: ' + point.value + 'px) and (max-width: ' + next.value + 'px)';
		} else {
			query = '(min-width: ' + point.value + 'px)';
		}

		return window.matchMedia(query).matches;
	});

	return current[0];
};

MGBreakpoint.prototype.buildEvents = function() {
	var events = {};
	this.points.forEach(function(point) {
		var eventOn = new Event(point.name.toLowerCase() + 'on');
		var eventOff = new Event(point.name.toLowerCase() + 'off');
		events[point.name] = {};
		events[point.name]['on'] = eventOn;
		events[point.name]['off'] = eventOff;
	});
	return events;
};