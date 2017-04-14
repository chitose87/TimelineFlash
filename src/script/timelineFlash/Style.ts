/// <reference path="../libs.d.ts" />
namespace timelineFlash {
	/**
	 *
	 * todo RGB
	 * todo CMYK
	 */
	export class Color {
		_number:number;

		static number(val:number):Color {
			var col:Color = new Color();
			col._number   = val;
			return col;
		}

		getCode():string {
			return "#" + ("000000" + (this._number || 0).toString(16)).slice(-6);
		}
	}

	export class Style {
		public static css;
		public static count = 0;

		public static color_base:Color        = Color.number(0x383838);
		public static color_main:Color        = Color.number(0xBBBBBB);
		public static color_reverse:Color     = Color.number(0x000000);
		public static color_select:Color      = Color.number(0xA8843A);
		public static color_border_dark:Color = Color.number(0x2b2b2b);

		public static border_dark:string = "1px solid " + Style.color_border_dark.getCode();

		static init() {
			console.log("style init");
			var newStyle  = document.createElement('style');
			newStyle.type = "text/css";
			document.getElementsByTagName('head').item(0).appendChild(newStyle);
			Style.css = document.styleSheets.item(0);

			Style.add({
				"*, *::before, *::after": {
					boxSizing: "border-box"
					, margin : 0
					, padding: 0
					, color  : Style.color_main
				}
				, "body"                : {
					fontSize    : "12px"
					, lineHeight: "22px"
					, userSelect: "none"
				}
				, "ul"                  : {
					listStyle: "none"
				}
				, ".Btn"                : {
					display: "inline-block"
				}
				, "button"              : {
					display     : "inline-block"
					, background: "none"
					, border    : "none"
					, minWidth  : "22px"
					, textAlign : "center"
					, lineHeight: "inherit"
					, outline   : "none"
					, padding   : "0 3px"
				}
				, "input"               : {
					background    : "transparent"
					, border      : 0
					, borderBottom: "1px dotted " + Style.color_select.getCode()
					, color       : Style.color_select
					, "&:focus"   : {
						border: "1px solid"
					}
				}
			});
		}

		static add(obj:any, scope:string = "") {
			var option:any = [];
			var next:any   = [];
			for (var i in obj) {
				var ele = obj[i];
				if (ele instanceof Color) {
					ele = (<Color>ele).getCode();
				}

				if (typeof ele == "object") {
					next.push([ele, i]);
				} else {
					var _name = i.replace(
						/([A-Z])/g,
						function (s) {
							return '-' + s.charAt(0).toLowerCase();
						}
					);
					option.push(_name + ":" + ele + ";");
				}
			}

			// set option
			if (option.length) {
				if (Style.css == null) Style.init();
				// try {
				console.log(scope);
				Style.css.insertRule(scope + "{" + option.join("") + "}", Style.count);
				Style.count++;
				// } catch (e) {
				// 	console.log("Style set error", e);
				// }
			}

			// next child
			for (var n = 0; n < next.length; n++) {
				var list  = [];
				var listA = scope.split(",");
				var listB = next[n][1].split(",");

				for (var a = 0; a < listA.length; a++) {
					for (var b = 0; b < listB.length; b++) {
						list.push(listA[a] + " " + listB[b]);
					}
				}
				Style.add(next[n][0], list.join(",").split(" &").join(""));
			}
		}
	}
}
