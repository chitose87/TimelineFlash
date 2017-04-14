var TimelineFlash = (function () {
	function TimelineFlash() {
		TimelineFlash.instance = this;
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
		this.child.document.write('<html><head><title>komado</title><style> * {margin: 0;padding: 0;}</style></head><body onload="new timelineFlash.Panel();"><script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.4.3/pixi.min.js"></script><script src="./script/TimelineFlash.js"></script></body></html>');
		this.child.document.close();

		this.timelines = {};
	}

	TimelineFlash.prototype.connect = function (panel) {
		this.panel = panel;
	};
	TimelineFlash.prototype.add = function (timeline) {
		console.log("add", timeline);
		this.timelines[timeline] = "";
		if (this.panel)this.panel.add(timeline);
	};
	return TimelineFlash;
}());
