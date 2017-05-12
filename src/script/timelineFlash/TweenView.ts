/// <reference path="../libs.d.ts" />
namespace timelineFlash {
	export class TweenView extends View implements IProperty {
		public static NAME:string = "TweenView";
		private static TEMPLATE:string = '' +
			'<div class="TweenView">' +
			'	<div class="frameView">' +
			'		<div class="leftNobView">' +
			'		</div>' +
			'		<div class="rightNobView">' +
			'		</div>' +
			'	</div>' +
			'</div>';

		private static LABEL_TEMPLATE:string = '' +
			'<div class="LabelView">' +
			'	<span class="name">' +
			'	</span>' +
			'</div>';

		private static PROPERTY_ELEMENT_VIEW:PropertyElementView = new PropertyElementView($('' +
			'<div class="TweenViewProp PropView">' +
			'	<label>selector' +
			'		<input type="text" name="selector" disabled>' +
			'	</label>' +
			'	<label>startTime' +
			'		<input type="number" min="0" step="0.01" name="startTime">' +
			'	</label>' +
			'	<label>duration' +
			'		<input type="number" min="0" step="0.01" name="duration">' +
			'	</label>' +
			'	<label>timeScale' +
			'		<input type="number" min="0" step="0.01" name="timeScale">' +
			'	</label>' +
			'	<ul class="" name="vars">' +
			'		<template>' +
			'			<li>' +
			'				<label>' +
			'					<span></span>' +
			'					<input type="text" name="">' +
			'				</label>' +
			'			</li>' +
			'		</template>' +
			'	</ul>' +
			'</div>'));

		private static style = (function () {
			Style.add({
				".TweenView": {
					position: "relative"
					, height: "22px"
					, width: "100%"
					, backgroundColor: "#494949"
					, borderBottom: Style.border_dark

					, ".frameView": {
						position: "relative"
						, height: "100%"
						, backgroundColor: "#62668A"
						, borderLeft: Style.border_dark
						, borderRight: Style.border_dark
						, "&.selected": {
							backgroundColor: Style.color_select
						}

						, ".leftNobView,.rightNobView": {
							position: "absolute"
							, width: "10px"
							, height: "100%"
							, display: "flex"
							, alignItems: "center"

							, "&:before": {
								content: "''"
								, display: "block"
								, width: "5px"
								, height: "5px"
								, marginLeft: "2.5px"
								, borderRadius: "50%"
								, backgroundColor: Style.color_reverse
							}
						}
						, ".leftNobView": {
							left: 0
						}
						, ".rightNobView": {
							right: 0
						}
					}
					, "&[data-method='set']": {
						".frameView .rightNobView": {
							display: "none"
						}
					}
					, "&[data-method='to']": {
						".frameView .leftNobView:before": {
							backgroundColor: "transparent"
							, border: "1px solid " + Style.color_reverse.getCode()
						}
					}
					, "&[data-method='from']": {
						".frameView .rightNobView:before": {
							backgroundColor: "transparent"
							, border: "1px solid " + Style.color_reverse.getCode()
						}
					}
				}
				, ".TimelineView .left .LabelView": {
					position: "relative"
					, height: "22px"
					, color: "#fff"
					, backgroundColor: "#494949"
					, borderBottom: Style.border_dark
					, "&.selected": {
						backgroundColor: Style.color_select
					}
					, "&:after": {
						marginLeft: "1em"
						, opacity: 0.5
					}
					, "&[data-method='set']:after": {
						content: "'-set-'"
					}
					, "&[data-method='from']:after": {
						content: "'-from-'"
					}
					, "&[data-method='fromTo']:after": {
						content: "'-fromTo-'"
					}
					, "&[data-method='to']:after": {
						content: "'-to-'"
					}
				}
				, ".TweenViewProp": {}
			});
			return;
		})();

		//----------------------------------------

		public tween:gsap.TweenMax;
		public frameView:View;
		public leftNobView:View;
		public rightNobView:View;
		public labelView:View;

		public methodType:string;

		constructor(tween:gsap.TweenMax) {
			super($(TweenView.TEMPLATE));
			this.tween = tween;

			//
			this.frameView = new View(this.jq.find(".frameView"));
			this.leftNobView = new View(this.jq.find(".leftNobView"));
			this.rightNobView = new View(this.jq.find(".rightNobView"));

			this.labelView = new View($(TweenView.LABEL_TEMPLATE));
			//

			// set method
			var varsObj:any = this.tween.vars;
			if (varsObj.runBackwards && varsObj.immediateRender) {
				this.methodType = "from";
			} else if (varsObj.startAt) {
				this.methodType = "fromTo";
			} else if (this.tween.duration() == 0 && varsObj.immediateRender == false) {
				this.methodType = "set";
			} else {
				this.methodType = "to";
			}
			this.jq.attr("data-method", this.methodType);
			this.labelView.jq.attr("data-method", this.methodType);

			//
			this.setAction();
			this.setLabel();

			this.update();
		}

		/**
		 *
		 */
		private setAction() {
			var mode:string = "none";
			var pageX:number;
			var ratio:number;
			var startTime:number;
			var duration:number;
			var timeScale:number;
			//
			var comm = (e)=> {
				pageX = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;

				startTime = this.tween.startTime();
				duration = this.tween.duration();
				timeScale = this.tween.timeScale();

				ratio = 100 / this.jq.width();
				// ratio = startTime / parseInt(this.frameView.jq.css("marginLeft")) || 1;

				onSelect();
			};
			var onSelect = ()=> {
				$(".frameView.selected,.TimelineView .LabelView").removeClass("selected");
				this.frameView.jq.addClass("selected");
				this.labelView.jq.addClass("selected");
			};

			this.frameView.jq
				.on("touchstart mousedown", (e:any)=> {
					if (mode != "none")return;
					mode = "move";
					comm(e);
				});
			this.leftNobView.jq
				.on("touchstart mousedown", (e:any)=> {
					mode = "start";
					comm(e);
				});
			this.rightNobView.jq
				.on("touchstart mousedown", (e:any)=> {
					mode = "duration";
					comm(e);
				});
			this.labelView.jq.on("touchstart mousedown", (e:any)=> onSelect());

			$(window)
				.on("touchmove mousemove", (e:any)=> {
					if (mode == "none")return;
					var _pageX = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
					var deffTime = (pageX - _pageX) * ratio;
					if (mode != "duration") startTime -= deffTime;
					if (mode == "start") duration += deffTime;
					if (mode == "duration") duration -= deffTime;

					this.frameView.jq.css({
						marginLeft: startTime + "%"
						, width: (duration * timeScale) + "%"
					});
					pageX = _pageX;
				})
				.on("touchend mouseup", (e:any)=> {
					if (mode == "none")return;
					mode = "none";

					this.tween.startTime(startTime);
					this.tween.duration(duration);
					this.update();
				});
		}

		/**
		 *
		 */
		private setLabel() {
			var option = this.tween.timeline["timelineFlashOption"];
			var _target:string;
			try {
				for (var key in option.targets) {
					if (this.tween["target"] == option.targets[key]) {
						_target = key;
						break;
					}
				}
			} catch (e) {
				_target = this.tween["target"].selector;
			}
			this.labelView.jq.find(".name").html(_target);
		}

		private update() {
			var startTime = this.tween.startTime();
			var duration = this.tween.duration();
			var timeScale = this.tween.timeScale();

			this.frameView.jq.css({
				marginLeft: startTime + "%"
				, width: (duration * timeScale) + "%"
			});
		}


		//---prop
		getPropertyElement():PropertyElementView {
			return TweenView.PROPERTY_ELEMENT_VIEW.reset(this, {
				selector: this.tween["target"].selector
				, startTime: this.tween.startTime()
				, duration: this.tween.duration()
				, timeScale: this.tween.timeScale()
				, vars: this.tween.vars
			});
		}

		changeProperty(name:string, val:any, option:any) {
			switch (name) {
				case "startTime":
					this.tween.startTime(val);
					break;
				case "duration":
					this.tween.duration(val);
					break;
				case "timeScale":
					this.tween.timeScale(val);
					break;
				case "vars":
					this.tween.updateTo(option.vars, true);
					break;
			}
			this.update();
		}

	}
}