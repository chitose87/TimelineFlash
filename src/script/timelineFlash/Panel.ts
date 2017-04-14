/// <reference path="../libs.d.ts" />
namespace timelineFlash {
	export class Panel extends View {
		static instance:Panel;
		private static style = (function () {
			console.log("Panel style")
			Style.add({
				".Panel": {
					width            : "100%"
					, height         : "100%"
					, backgroundColor: Style.color_base
					, ".MenuBarView" : {
						height : "22px"
						, width: "100%"
					}
					, ".box"         : {
						display           : "flex"
						, ".PropertyView" : {
							minWidth: "300px"
							// , height: "100%"
						}
						, ".timelinesView": {
							flexGrow: 1
						}
					}
				}
			});
			return;
		})();

		public uid:string;
		public menuBarView:MenuBarView;
		public propertyView:PropertyView;
		public timelinesView:View;
		public timelines:any;

		constructor() {
			super($('' +
				'<div class="Panel">' +
				'	<div class="MenuBarView">' +
				'	</div>' +
				'	<div class="box">' +
				'		<div class="timelinesView">' +
				'		</div>' +
				'		<div class="PropertyView">' +
				'		</div>' +
				'	</div>' +
				'</div>'));
			//dev
			try {
				console = window.opener.console
			} catch (e) {
			}

			this.uid = $("body").data("id");
			$("body").append(this.jq);
			console.log("Panel");
			Panel.instance = this;

			this.menuBarView   = new MenuBarView(this.jq.find(".MenuBarView"));
			this.propertyView  = new PropertyView(this.jq.find(".PropertyView"));
			this.timelinesView = new View(this.jq.find(".timelinesView"));
			//

			$(window).on("resize", ()=>this.resize());
			this.resize();

			window.opener["TimelineFlash"].instance.connect(this);
			this.timelines = window.opener["TimelineFlash"].instance.timelines;

			console.log(this.timelines);

			for (var i in this.timelines) {
				console.log(i, this.timelines[i]);
				this.add(this.timelines[i]);
			}

			this.update();
		}

		public resize() {

		}

		private update() {
			try {
				if (window.opener["TimelineFlash"].instance.uid != this.uid) {
					self.close();
					return;
				}
			} catch (e) {
				self.close();
				return;
			}
			window.requestAnimationFrame(()=>this.update());
		}

		public add(timeline:gsap.TimelineMax | any) {
			console.log("Panel", timeline);
			var timelineView:TimelineView = new TimelineView(timeline);

			this.timelinesView.addChild(timelineView);
		}
	}
}
