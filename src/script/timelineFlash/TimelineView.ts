/// <reference path="../libs.d.ts" />
namespace timelineFlash {
	export class TimelineView extends View {
		static NAME:string             = "TimelineView";
		private static TEMPLATE:string = '' +
			'<div class="TimelineView">' +
			'	<div class="left">' +
			'		<div class="timelineLabelView">' +
			'			<span class="name">' +
			'			</span>' +
			'			<button class="playBtn">\u25b6</button>' +
			'			<button class="stopBtn">\u25a0</button>' +
			'		</div>' +
			'		<div class="labelsView">' +
			'		</div>' +
			'		<div class="ToolBarView">' +
			'		</div>' +
			'	</div>' +
			'	<div class="scrollView">' +
			'		<div class="scaleView">' +
			'			<div class="RulerView">' +
			'			</div>' +
			'			<div class="tweensView">' +
			'			</div>' +
			'			<div class="seekBarView">' +
			'			</div>' +
			'		</div>' +
			'	</div>' +
			'</div>';

		private static style = (function () {
			Style.add({
				".TimelineView": {
					display          : "flex"
					, minHeight      : "44px"
					, backgroundColor: "#444444"
					, ".left"        : {
						display               : "flex"
						, flexDirection       : "column"
						, borderRight         : "1px solid #2b2b2b"
						, ".timelineLabelView": {
							display      : "flex"
							, height     : "22px"
							, color      : "#fff"
							, paddingLeft: "0.5em"
							, ".name"    : {
								flexGrow: 1
							}
						}
						, ".labelsView"       : {
							minWidth  : "300px"
							, flexGrow: 1

						}
					}
					, ".scrollView"  : {
						flexGrow      : 1
						, overflowX   : "scroll"
						, ".scaleView": {
							position        : "relative"
							, minWidth      : "100%"
							, width         : "500%"
							, ".seekBarView": {
								position    : "absolute"
								, top       : "22px"
								, left      : "0px"
								, width     : "1px"
								, height    : "calc(100% - 22px)"
								, borderLeft: "1px solid #B20200"

								, "&:before": {
									content          : "''"
									, display        : "block"
									, position       : "absolute"
									, top            : "-22px"
									, left           : "-5px"
									, width          : "10px"
									, height         : "22px"
									, backgroundColor: "rgba(178,2,0,0.4)"
									, border         : "1px solid #B20200"
								}
							}
						}
					}
					, ".PropertyView": {}
				}
			});
			return;
		})();

		public timeline:gsap.TimelineMax;
		public labelsView:View;
		public timelineLabelView:View;
		public scrollView:View;
		public tweensView:View;
		public seekBarView:View;
		public toolBarView:ToolBarView;
		public rulerView:RulerView;
		public playBtn:View;
		public stopBtn:View;

		public _onStart:any;
		public _onUpdate:any;
		public _onComplete:any;

		constructor(timeline:gsap.TimelineMax) {
			super($(TimelineView.TEMPLATE));
			this.timeline = timeline;

			this.labelsView        = new View(this.jq.find(".labelsView"));
			this.timelineLabelView = new View(this.jq.find(".timelineLabelView"));
			this.scrollView        = new View(this.jq.find(".scrollView"));
			this.rulerView         = new RulerView(this.jq.find(".RulerView"));
			this.toolBarView       = new ToolBarView(this.jq.find(".toolBarView"));
			this.tweensView        = new View(this.jq.find(".tweensView"));
			this.seekBarView       = new View(this.jq.find(".seekBarView"));

			this.playBtn = new View(this.jq.find(".playBtn"));
			this.stopBtn = new View(this.jq.find(".stopBtn"));
			//
			this.createTweenLine(this.timeline["_first"]);


			// events
			var _onStart = this._onStart = this.timeline["_onStart"];
			var _onUpdate = this._onUpdate = this.timeline["_onUpdate"];
			var _onComplete = this._onComplete = this.timeline["_onComplete"];

			this.timeline
				.eventCallback("onUpdate", ()=> {
					if (_onUpdate)_onUpdate.call(this.timeline);
					this.onUpdate();
				});

			this.playBtn.jq.on("click", ()=> {
				console.log("playBtn");
				this.timeline.play();
			});
			this.stopBtn.jq.on("click", ()=> {
				this.timeline.pause();
			});

			this.setAction();
			this.setLabel();

			// complete
			// this.onUpdate();
		}

		private createTweenLine(tween:gsap.TweenMax) {
			var tweenView:TweenView = new TweenView(tween);
			this.tweensView.addChild(tweenView);
			this.labelsView.addChild(tweenView.labelView);

			try {
				this.createTweenLine(tween["_next"]);
			} catch (e) {

			}
		}

		/**
		 *
		 */
		private setAction() {
			var mode:string = "none";
			var pageX:number;
			var ratio:number;
			var currentTime:number;
			//

			this.seekBarView.jq
				.on("touchstart mousedown", (e:any)=> {
					mode  = "down";
					pageX = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;

					currentTime = this.timeline.time();
					ratio       = 100 / this.scrollView.jq.find(".scaleView").width();
				});

			$(window)
				.on("touchmove mousemove", (e:any)=> {
					if (mode == "none")return;
					var _pageX   = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
					var deffTime = (pageX - _pageX) * ratio;

					currentTime -= deffTime;
					this.timeline.time(currentTime > 0 ? currentTime : 0);

					pageX = _pageX;
				})
				.on("touchend mouseup", (e:any)=> {
					if (mode == "none")return;
					mode = "none";
				});

			this.rulerView.jq.on("touchstart mousedown", (e:any)=> {
				console.log(e);
				pageX = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
				pageX -= this.scrollView.jq.offset().left;
				pageX += this.scrollView.jq.scrollLeft();
				ratio = 100 / this.scrollView.jq.find(".scaleView").width();
				this.timeline.pause();
				this.timeline.time(pageX * ratio);
			});
		}

		private setLabel() {
			var option         = this.timeline["timelineFlashOption"];
			var _target:string = "";
			try {
				_target = option.label;
			} catch (e) {
			}
			this.timelineLabelView.jq.find(".name").html(_target);
		}

		onUpdate() {
			this.seekBarView.jq.css(
				"left", this.timeline.time() + "%"
				// "transform", "translateX(" + __this.timeline.time() + "%)"
			);
		}
	}
}