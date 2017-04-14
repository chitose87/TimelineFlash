/// <reference path="../libs.d.ts" />
namespace timelineFlash {
	import TimelineMax = gsap.TimelineMax;
	import Timeline = gsap.Timeline;
	export class Panel {
		static instance:Panel;
		public parent:window = window.opener;
		public renderer:PIXI.WebGLRenderer | PIXI.CanvasRenderer;
		public stage:Stage = new Stage();

		constructor() {
			console.log("Panel");
			window.panel = this;
			Panel.instance = this;

			this.renderer = PIXI.autoDetectRenderer(
				256, 256,
				{antialias: true, transparent: true, resolution: 1}
			);
			document.body.appendChild(this.renderer.view);

			window.onresize = ()=>this.resize();
			window.onresize();

			// console.log(this.parent.TimelineFlash.instance);
			this.parent.TimelineFlash.instance.connect(this);

			this.update();
		}

		public resize() {
			this.renderer.autoResize = true;
			this.renderer.resize(window.innerWidth, window.innerHeight);

			this.stage.onResize(window.innerWidth, window.innerHeight);
		}

		private update() {
			if (!this.parent.document) {
				self.close();
				return;
			}
			window.requestAnimationFrame(()=>this.update());
			this.renderer.render(this.stage);
		}

		public add(timeline:Timeline) {

		}
	}
}
