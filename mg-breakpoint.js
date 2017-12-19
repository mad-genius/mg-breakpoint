/*
  __  __  _____ ____                 _                _       _     _     
 |  \/  |/ ____|  _ \               | |              (_)     | |   (_)    
 | \  / | |  __| |_) |_ __ ___  __ _| | ___ __   ___  _ _ __ | |_   _ ___ 
 | |\/| | | |_ |  _ <| '__/ _ \/ _` | |/ / '_ \ / _ \| | '_ \| __| | / __|
 | |  | | |__| | |_) | | |  __/ (_| |   <| |_) | (_) | | | | | |_ _| \__ \
 |_|  |_|\_____|____/|_|  \___|\__,_|_|\_\ .__/ \___/|_|_| |_|\__(_) |___/
                                         | |                      _/ |    
                                         |_|                     |__/

* MG Breakpoint
*
* Copyright (c) 2017 Mad Genius Inc (https://madg.com)
*
* By Blake Watson (@blakewatson)
* Licensed under the MIT license.
*
* @link https://github.com/Mad-Genius/mg-breakpoint
* @author Blake Watson
* @version 1.0.1
*/

function MGBreakpoint(points, options) {
	this.options = this.mergeOptions(options);
	this.points = this.mergePoints(points, this.options.removeDefaultBreakpoints);
	this.lastBreakpoint = this.getCurrentBreakpoint();
	this.events = this.buildEvents();
	this.init();
}

MGBreakpoint.prototype.init = function() {
	var self = this;
	var current = self.getCurrentBreakpoint();

	self.updateBodyClass(current.name);

	window.addEventListener('resize', function() {
		var current = self.getCurrentBreakpoint();

		// if breakpoint has changed
		if(current.name !== self.lastBreakpoint.name) {
			// dispatch enter event for current breakpoint
			window.dispatchEvent(self.events[current.name]['enter']);

			// dispatch leave event for last breakpoint
			window.dispatchEvent(self.events[self.lastBreakpoint.name]['leave']);

			// dispatch min event if getting wider
			// else dispatch max event if getting narrower
			if(current.value > self.lastBreakpoint.value) {
				window.dispatchEvent(self.events[current.name]['min']);
			} else if(current.value < self.lastBreakpoint.value) {
				window.dispatchEvent(self.events[self.lastBreakpoint.name]['max']);
			}

			// update the body class
			self.updateBodyClass(current.name, self.lastBreakpoint.name);

			// update last breakpoint
			self.lastBreakpoint = current;
		}
	});
};

MGBreakpoint.prototype.mergeOptions = function(options) {
	var defaults = {
		removeDefaultBreakpoints: false,
		updateBodyClass: true
	};

	if(typeof options === 'object') {
		for(var option in defaults) {
			if(options.hasOwnProperty(option)) {
				defaults[option] = options[option];
			}
		}
	}

	return defaults;
}

MGBreakpoint.prototype.mergePoints = function(points, removeDefaultBreakpoints) {
	var defaults = {
		phone: 0,
		tabletPortrait: 600,
		tabletLandscape: 900,
		desktop: 1200,
		bigDesktop: 1800
	};
	var pointsArray = [];

	// if clean is true, clear out the defaults
	if(removeDefaultBreakpoints) {
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

MGBreakpoint.prototype.updateBodyClass = function(newName, oldName) {
	if(!this.options.updateBodyClass) return;

	var body = document.querySelector('body');
	
	if(oldName) {
		body.classList.remove('mgb-' + oldName.toLowerCase());
	}
	if(newName) {
		body.classList.add('mgb-' + newName.toLowerCase());
	}
};

MGBreakpoint.prototype.enter = function(breakpoint, callback) {
	window.addEventListener(breakpoint.toLowerCase() + 'enter', callback);
};

MGBreakpoint.prototype.leave = function(breakpoint, callback) {
	window.addEventListener(breakpoint.toLowerCase() + 'leave', callback);
};

MGBreakpoint.prototype.min = function(breakpoint, callback) {
	window.addEventListener(breakpoint.toLowerCase() + 'min', callback);
};

MGBreakpoint.prototype.max = function(breakpoint, callback) {
	window.addEventListener(breakpoint.toLowerCase() + 'max', callback);
};

MGBreakpoint.prototype.isMin = function(breakpoint, callback) {
	var result = window.matchMedia('(min-width: ' + this.get(breakpoint).value + 'px)').matches;

	if(callback && result) {
		callback();
	}

	return result;
};

MGBreakpoint.prototype.isMax = function(breakpoint, callback) {	
	var result = window.matchMedia('(max-width: ' + (this.get(breakpoint).value - 1) + 'px)').matches;

	if(callback && result) {
		callback();
	}
	
	return result;
};

MGBreakpoint.prototype.isMinMax = function(min, max, callback) {
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
		var eventEnter = new CustomEvent(point.name.toLowerCase() + 'enter');
		var eventLeave = new CustomEvent(point.name.toLowerCase() + 'leave');
		var eventMin = new CustomEvent(point.name.toLowerCase() + 'min');
		var eventMax = new CustomEvent(point.name.toLowerCase() + 'max');
		events[point.name] = {};
		events[point.name]['enter'] = eventEnter;
		events[point.name]['leave'] = eventLeave;
		events[point.name]['min'] = eventMin;
		events[point.name]['max'] = eventMax;
	});
	return events;
};