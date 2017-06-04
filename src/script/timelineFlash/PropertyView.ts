/// <reference path="../libs.d.ts" />
namespace timelineFlash {
	export class PropertyView extends View {
		private static TEMPLATE:string = '' +
			'<div class="scrollView">' +
			'</div>';
		//
		private static style = (function () {
			Style.add({
				".scrollView": {
					position: "relative"
					, width: "100%"
					, minHidth: "100%"
				}
			});
			return;
		})();

		public scrollView:View;

		constructor(jq:JQuery) {
			super(jq.append(PropertyView.TEMPLATE));

			this.scrollView = new View(this.jq.find(".scrollView"));

			$(window)
				.on("touchstart mousedown", (e)=> {
					this.checkClass($(e.target));
				});
		}

		private checkClass(target:JQuery) {
			if (target.hasClass(TweenView.NAME)) {
				this.setProperty(target.data("instance"));
			} else if (target.hasClass(TimelineView.NAME)) {
				this.setProperty(target.data("instance"));
			} else {
				try {
					this.checkClass(target.parent())
				} catch (e) {
					return;
				}
			}
		}

		private setProperty(view:IProperty) {
			var pev:PropertyElementView = view.getPropertyElement();

			this.scrollView
			// .removeChildAll()
				.addChild(pev);
		}
	}

	/**
	 *
	 */
	export class PropertyElementView extends View {
		private static style = (function () {
			Style.add({
				".PropView": {
					paddingLeft: "0.5em"
					, label: {
						display: "flex"
						, justifyContent: "space-between"
						// , "input": {
						// 	color: Style.color_reverse
						// }
					}
					, ul: {
						paddingLeft: "1rem"
						, "&:before": {
							content: "attr(data-before)"
							, display: "block"
							, marginLeft: "-1rem"
						}
					}
				}
			});
			return;
		})();

		instance:IProperty;
		option:any;

		constructor(jq:JQuery) {
			super(jq);

			this.jq.on("change", "input", (e)=> {
				var target = $(e.target);
				var name = target.attr("name");
				var val = target.val();

				var path = name.split(".");
				var obj = this.option;
				var i = 0;
				for (i; i < path.length - 1; i++) {
					obj = obj[path[i]];
				}
				obj[path[i]] = val;
				this.instance.changeProperty(path[0], val, this.option);
			})
		}

		/**
		 *
		 * @param instance
		 * @param option
		 * @returns {timelineFlash.PropertyElementView}
		 */
		reset(instance:IProperty, option:any):PropertyElementView {
			this.instance = instance;
			this.option = option;

			this.jq.find("template").parent().find(">*:not(template)").remove();

			for (var i in this.option) {
				var target = this.jq.find("[name='" + i + "']");
				var val = this.option[i];
				switch (typeof val) {
					case "object":
						hoge(target, i, val, target.find(">template"));
						break;
					default:
						target.val(val);
						break;
				}
			}

			function hoge(target:JQuery, name, val, template:JQuery) {
				target.attr("data-before", name.split(".").pop());
				for (var i in val) {
					// ignore
					if (i == "timelineFlashPosition")continue;

					var _val = val[i];
					switch (typeof _val) {
						case "object":
							var _target = $("<ul></ul>");
							target.append(_target);
							hoge(_target, name + "." + i, _val, template);
							break;
						default:
							var ele:JQuery = $(document.importNode(template[0]["content"], true));
							ele
								.find("input")
								.prop("name", name + "." + i)
								.val(_val);
							ele
								.find("span")
								.html(i);
							target.append(ele);
							break;
					}
				}
			}

			return this;
		}
	}
}