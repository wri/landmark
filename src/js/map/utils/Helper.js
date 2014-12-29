define([
	'dojo/on',
	'dojo/topic',
	'dojo/dom-class',
	'dojo/dom-geometry',
	'dojo/_base/window'
], function (on, topic, domClass, domGeom, win) {

	var body = win.body(),
			threshold = 900,
			prevWidth,
			width;

	/**
	* Add or remove mobile class and publish a method others can subscribe to for a layout change
	*/
	function applyLayout() {
		width = domGeom.position(body).w;
		if (width < threshold) {
			domClass.add(body, "mobile");
		} else {
			domClass.remove(body, "mobile");
		}

		// Dont broadcast every time the window changes size, 
		// only when switching to phone or desktop
		if (prevWidth < threshold && width > threshold) {
			topic.publish("changedLayout", false);
		}
		if (prevWidth > threshold && width < threshold) {
			topic.publish("changedLayout", true); // True for changing to mobile
		}
		prevWidth = width;
	}

	var Helper = {

		/**
		* Apply layout class and listener
		*/
		enableLayout: function () {
			brApp.debug('Helper >>> enableLayout');
			applyLayout();
			on(win.global, 'resize', applyLayout);
		},

		/**
		* @return {boolean} whether or not the width of the screen is above or below the threshold
		*/ 
		isMobile: function () {
			return width ? width < threshold : domGeom.position(body).w < threshold;
		}

	};

	return Helper;

});