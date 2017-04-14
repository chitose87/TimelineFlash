var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../libs.d.ts" />
var timelineFlash;
(function (timelineFlash) {
    var Stage = (function (_super) {
        __extends(Stage, _super);
        function Stage() {
            _super.call(this);
        }
        Stage.prototype.onResize = function (w, h) {
        };
        return Stage;
    }(PIXI.Container));
    timelineFlash.Stage = Stage;
})(timelineFlash || (timelineFlash = {}));
/// <reference path="../libs.d.ts" />
var timelineFlash;
(function (timelineFlash) {
    var Panel = (function () {
        function Panel() {
            var _this = this;
            this.parent = window.opener;
            this.stage = new timelineFlash.Stage();
            console.log("Panel");
            window.panel = this;
            Panel.instance = this;
            this.renderer = PIXI.autoDetectRenderer(256, 256, { antialias: true, transparent: true, resolution: 1 });
            document.body.appendChild(this.renderer.view);
            window.onresize = function () { return _this.resize(); };
            window.onresize();
            // console.log(this.parent.TimelineFlash.instance);
            this.parent.TimelineFlash.instance.connect(this);
            this.update();
        }
        Panel.prototype.resize = function () {
            this.renderer.autoResize = true;
            this.renderer.resize(window.innerWidth, window.innerHeight);
            this.stage.onResize(window.innerWidth, window.innerHeight);
        };
        Panel.prototype.update = function () {
            var _this = this;
            if (!this.parent.document) {
                self.close();
                return;
            }
            window.requestAnimationFrame(function () { return _this.update(); });
            this.renderer.render(this.stage);
        };
        Panel.prototype.add = function (timeline) {
        };
        return Panel;
    }());
    timelineFlash.Panel = Panel;
})(timelineFlash || (timelineFlash = {}));
//# sourceMappingURL=TimelineFlash.js.map