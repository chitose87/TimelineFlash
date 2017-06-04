var TimelineFlash = (function () {
	function TimelineFlash() {
		TimelineFlash.instance = this;
		this.uid = Math.floor(Math.random() * 1000);
		this.child = window.open("", "", "scrollbars=1" +
			",resizable=1" +
			",menubar='no'" +
			",toolbar='no'" +
			",location='no'" +
			",status='no'" +
			",width=" + window.outerWidth +
			",height=" + window.outerHeight / 3 +
			",top=" + window.outerHeight * 2 / 3 +
			"");
		this.child.document.clear();
		this.child.document.write('<html><head><title>TimelineFlash v0.1</title></head><body data-id='+this.uid+'><script src="./script/TimelineFlash.js"></script></body></html>');
		this.child.document.close();

		this.timelines = [];


		// overrite
		var p = TimelineLite.prototype;
		var _to = p.to;
		p.to = function (target, duration, vars, position) {
			if (position != undefined)vars.timelineFlashPosition = position;
			return _to.apply(this, [target, duration, vars, position]);
		};
		var _from = p.from;
		p.from = function (target, duration, vars, position) {
			if (position != undefined)vars.timelineFlashPosition = position;
			return _from.apply(this, [target, duration, vars, position]);
		};
		var _fromTo = p.fromTo;
		p.fromTo = function (target, duration, fromVars, toVars, position) {
			if (position != undefined)toVars.timelineFlashPosition = position;
			return _fromTo.apply(this, [target, duration, fromVars, toVars, position]);
		};

		// var add = p.add;
		// p.add = function (value, position, align, stagger) {
		// 	if (position != undefined)value.vars.timelineFlashPosition = position;
		// 	return add.apply(this, [value, position, align, stagger]);
		// }
	}

	TimelineFlash.prototype.connect = function (panel) {
		this.panel = panel;
	};
	TimelineFlash.prototype.add = function (timeline, option) {
		console.log("add", timeline, option);
		if (option)timeline.timelineFlashOption = option;
		this.timelines.push(timeline);
		if (this.panel)this.panel.add(timeline);
	};
	return TimelineFlash;
}());