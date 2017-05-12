/// <reference path="../libs.d.ts" />
namespace timelineFlash {
	export class RulerView extends View {

		private static style = (function () {
			Style.add({
				".RulerView": {
					position: "relative"
					, overflow: "hidden"
					, width: "100%"
					, height: "22px"
					, paddingLeft: "2.5%"
					, boxSizing: "content-box"
					, ".labelView": {
						fontSize: "10px"
						, display: "inline-block"
						, textAlign: "center"
						, color: "#fff"
						, width: "5%"
					}
				}
			});
			return;
		})();

		public labelViews:View[] = [];

		constructor(jq:JQuery) {
			super(jq);

			this.update();
		}

		private update() {
			var count = 5;
			var labelView:View;
			while (true) {
				labelView = this.labelViews[count];
				if (!labelView) {
					labelView = new View("labelView");
					labelView.jq
						.html(count + "");
					this.addChild(labelView);
					this.labelViews[count] = labelView;
				}
				count += 5;
				if (count > 100)break;
			}
		}
	}
}