//// <reference path="../libs.d.ts" />

namespace timelineFlash {
	export class View {
		public jq:JQuery;
		public parent:View;

		constructor(jq:JQuery|string = null) {
			if (typeof jq == "string") {
				this.jq = $("<div></div>").addClass(<string>jq);
			} else if (!jq) {
				this.jq = $("<div></div>");
			} else {
				this.jq = <JQuery>jq;
			}
			this.jq
				.addClass("View")
				.data("instance", this);
		}

		addChild(view:View):View {
			try {
				this.jq.append(view.jq);
				view.parent = this;
			} catch (e) {
				console.log(view);
			}
			return this;
		}

		removeChild(view:View):View {
			try {
				delete view.parent;
				view.jq.remove();
			} catch (e) {
				console.log(view);
			}
			return this;
		}

		removeChildAt(i:number):View {
			var target = this.jq.children()[i];
			var view:View = $(target).data("instance");

			return this.removeChild(view);
		}

		removeChildAll():View {
			var children = this.jq.children();
			for (var i = children.length - 1; i >= 0; i--) {
				var view:View = $(children[i]).data("instance");
				this.removeChild(view);
			}
			children.remove();
			return this;
		}
	}
}