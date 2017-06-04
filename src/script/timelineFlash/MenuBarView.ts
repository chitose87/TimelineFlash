/// <reference path="../libs.d.ts" />
namespace timelineFlash {
	export class MenuBarView extends View {
		private static TEMPLATE:string = '' +
			'<div class="left">' +
			'	<button class="exportBtn">Export</button>' +
			'</div>';
		
		private static style = (function () {
			Style.add({
				".MenuBarView": {
					position: "relative"
					, ".left": {
						".exportBtn": {}
					}
				}
			});
			return;
		})();

		//
		constructor(jq:JQuery) {
			super(jq.append(MenuBarView.TEMPLATE));

			this.jq.on("click", ".exportBtn", ()=> {
				var str:string = this.export();
				console.log(str);
				alert(str);
			});
		}

		/**
		 *
		 * @returns {string}
		 */
		private export():string {
			var timelinesView:View = Panel.instance.timelinesView;
			var list;
			var resultArr:string[] = [];
			var option:any;
			var arr;

			list = timelinesView.jq.children();
			for (var i = 0; i < list.length; i++) {
				var tlView:TimelineView = $(list[i]).data("instance");
				if (tlView) {
					option = tlView.timeline["timelineFlashOption"];

					// console.log(tlView.timeline);

					// label
					var label:string = (option && option.label) ? option.label : 'tl';

					// set timeline option
					var tlOption:string = "";
					var varsObj:any = tlView.timeline.vars;
					arr = [];

					for (var key in varsObj) {
						if (key.indexOf("onStart") >= 0
							|| key.indexOf("onUpdate") >= 0
							|| key.indexOf("onComplete") >= 0)continue;

						arr.push(toKeyValue(key, varsObj[key]));
					}
					if (tlView._onStart)arr.push(toKeyValue("onStart", tlView._onStart.toString()));
					if (tlView._onUpdate)arr.push(toKeyValue("onUpdate", tlView._onUpdate.toString()));
					if (tlView._onComplete)arr.push(toKeyValue("onComplete", tlView._onComplete.toString()));
					if (arr.length) {
						tlOption = '{\n' + arr.join('\n,') + '\n}';
					}
					resultArr.push('var ' + label + '=TimelineMax(' + tlOption + ')');

					// set tween
					var time = 0;
					var tlChild = tlView.tweensView.jq.children();
					for (var n = 0; n < tlChild.length; n++) {
						var twView:TweenView = $(tlChild[n]).data("instance");
						var varsObj:any = twView.tween.vars;
						var startTime = twView.tween.startTime();
						var duration:number = twView.tween.duration();

						// console.log(twView.tween);

						// set method
						var _method:string = twView.methodType;

						// set target
						var _target:string;
						try {
							for (var key in option.targets) {
								if (twView.tween["target"] == option.targets[key]) {
									_target = key;
									break;
								}
							}
						} catch (e) {
							_target = '$("' + twView.tween["target"].selector + '")';
						}

						// set vars
						var _vars:string;
						arr = [];
						for (var key in varsObj) {
							if (
								key == "timelineFlashPosition"
								|| (_method == "from" && (key == "runBackwards" || key == "immediateRender"))
								|| (_method == "fromTo" && (key == "startAt" || key == "immediateRender"))
								|| (_method == "set" && (key == "immediateRender"))
							) {
								continue;
							}
							arr.push(toKeyValue(key, varsObj[key]));
						}
						_vars = ',{' + arr.join(',') + '}';
						if (varsObj.startAt) {
							arr = [];
							for (var key in varsObj.startAt) {
								arr.push(key + ':' + '"' + varsObj.startAt[key] + '"')
							}
							_vars = ',{' + arr.join(',') + '}' + _vars;
						}

						// position
						var _position:any = varsObj.timelineFlashPosition;

						// absolute
						if (typeof(_position) == "number") {
							_position = ',' + startTime;
						} else {
							var v = startTime - time;
							if (v == 0) {
								_position = '';
							} else if (v < 0) {
								_position = ',"-=' + Math.abs(v) + '"';
							} else {
								_position = ',"+=' + v + '"';
							}
						}

						// set duration
						var _duration = _method != "set" ? "," + duration : "";

						// comp
						resultArr.push('\t.' + _method + '(' + _target + _duration + _vars + _position + ')');
						time = startTime + duration;
					}
					resultArr[resultArr.length - 1] += ";";
				}
			}

			return resultArr.join("\n");

			function toKeyValue(key:string, val:any):string {
				if (
					typeof val != "boolean"
					&& typeof val != "number"
					&& val.indexOf("function") != 0
				) {
					val = '"' + val + '"';
				}
				return key + ':' + val;
			}
		}
	}
}