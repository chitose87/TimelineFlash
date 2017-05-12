/// <reference path="../libs.d.ts" />
namespace timelineFlash {
	export class ToolBarView extends View {
		private static TEMPLATE:string = '' +
			'<div class="leftView">' +
			'	<button class="addTweenBtn">\uff0b</button>' +
			'	<button class="removeTweenBtn">\u2212</button>' +
			'</div>';

		private static style = (function () {
			Style.add({
				".ToolBarView": {
					position: "relative"
					, ".leftView": {
						".addTweenBtn": {}
					}
				}
			});
			return;
		})();

		public addTweenBtn:JQuery;
		public removeTweenBtn:JQuery;

		constructor(jq:JQuery) {
			super(jq.append(ToolBarView.TEMPLATE));

			this.addTweenBtn = this.jq.find(".addTweenBtn")
				.on("click", ()=> {

				});
			this.removeTweenBtn = this.jq.find(".removeTweenBtn")
				.on("click", ()=> {

				});
		}
	}
}