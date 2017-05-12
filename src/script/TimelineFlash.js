var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../libs.d.ts" />
var timelineFlash;
(function (timelineFlash) {
    /**
     *
     * todo RGB
     * todo CMYK
     */
    var Color = (function () {
        function Color() {
        }
        Color.number = function (val) {
            var col = new Color();
            col._number = val;
            return col;
        };
        Color.prototype.getCode = function () {
            return "#" + ("000000" + (this._number || 0).toString(16)).slice(-6);
        };
        return Color;
    }());
    timelineFlash.Color = Color;
    var Style = (function () {
        function Style() {
        }
        Style.init = function () {
            var newStyle = document.createElement('style');
            newStyle.type = "text/css";
            document.getElementsByTagName('head').item(0).appendChild(newStyle);
            Style.css = document.styleSheets.item(0);
            Style.add({
                "*, *::before, *::after": {
                    boxSizing: "border-box",
                    margin: 0,
                    padding: 0,
                    color: Style.color_main
                },
                "body": {
                    fontSize: "12px",
                    lineHeight: "22px",
                    userSelect: "none"
                },
                "ul": {
                    listStyle: "none"
                },
                ".Btn": {
                    display: "inline-block"
                },
                "button": {
                    display: "inline-block",
                    background: "none",
                    border: "none",
                    minWidth: "22px",
                    textAlign: "center",
                    lineHeight: "inherit",
                    outline: "none"
                }
            });
        };
        Style.add = function (obj, scope) {
            if (scope === void 0) { scope = ""; }
            var option = [];
            var next = [];
            for (var i in obj) {
                var ele = obj[i];
                if (ele instanceof Color) {
                    ele = ele.getCode();
                }
                if (typeof ele == "object") {
                    next.push([ele, i]);
                }
                else {
                    var _name = i.replace(/([A-Z])/g, function (s) {
                        return '-' + s.charAt(0).toLowerCase();
                    });
                    option.push(_name + ":" + ele + ";");
                }
            }
            // set option
            if (option.length) {
                if (Style.css == null)
                    Style.init();
                // try {
                console.log(scope);
                Style.css.insertRule(scope + "{" + option.join("") + "}", Style.length);
                length++;
            }
            // next child
            for (var n = 0; n < next.length; n++) {
                var list = [];
                var listA = scope.split(",");
                var listB = next[n][1].split(",");
                for (var a = 0; a < listA.length; a++) {
                    for (var b = 0; b < listB.length; b++) {
                        list.push(listA[a] + " " + listB[b]);
                    }
                }
                Style.add(next[n][0], list.join(",").split(" &").join(""));
            }
        };
        Style.length = 0;
        Style.color_base = Color.number(0x383838);
        Style.color_main = Color.number(0xFFFFFF);
        Style.color_reverse = Color.number(0x000000);
        Style.color_select = Color.number(0xA8843A);
        Style.color_border_dark = Color.number(0x2b2b2b);
        Style.border_dark = "1px solid " + Style.color_border_dark.getCode();
        return Style;
    }());
    timelineFlash.Style = Style;
})(timelineFlash || (timelineFlash = {}));
/// <reference path="../libs.d.ts" />
var timelineFlash;
(function (timelineFlash) {
    var View = (function () {
        function View(jq) {
            if (jq === void 0) { jq = null; }
            if (typeof jq == "string") {
                this.jq = $("<div></div>").addClass(jq);
            }
            else if (!jq) {
                this.jq = $("<div></div>");
            }
            else {
                this.jq = jq;
            }
            this.jq
                .addClass("View")
                .data("instance", this);
        }
        View.prototype.addChild = function (view) {
            try {
                this.jq.append(view.jq);
                view.parent = this;
            }
            catch (e) {
                console.log(view);
            }
            return this;
        };
        View.prototype.removeChild = function (view) {
            try {
                delete view.parent;
                view.jq.remove();
            }
            catch (e) {
                console.log(view);
            }
            return this;
        };
        View.prototype.removeChildAt = function (i) {
            var target = this.jq.children()[i];
            var view = $(target).data("instance");
            return this.removeChild(view);
        };
        View.prototype.removeChildAll = function () {
            var children = this.jq.children();
            for (var i = children.length - 1; i >= 0; i--) {
                var view = $(children[i]).data("instance");
                this.removeChild(view);
            }
            children.remove();
            return this;
        };
        return View;
    }());
    timelineFlash.View = View;
})(timelineFlash || (timelineFlash = {}));
/// <reference path="../libs.d.ts" />
var timelineFlash;
(function (timelineFlash) {
    var PropertyView = (function (_super) {
        __extends(PropertyView, _super);
        function PropertyView(jq) {
            var _this = this;
            _super.call(this, jq.append(PropertyView.TEMPLATE));
            this.scrollView = new timelineFlash.View(this.jq.find(".scrollView"));
            $(window)
                .on("touchstart mousedown", function (e) {
                _this.checkClass($(e.target));
            });
        }
        PropertyView.prototype.checkClass = function (target) {
            if (target.hasClass(timelineFlash.TweenView.NAME)) {
                this.setProperty(target.data("instance"));
            }
            else if (target.hasClass(timelineFlash.TimelineView.NAME)) {
                this.setProperty(target.data("instance"));
            }
            else {
                try {
                    this.checkClass(target.parent());
                }
                catch (e) {
                    return;
                }
            }
        };
        PropertyView.prototype.setProperty = function (view) {
            var pev = view.getPropertyElement();
            this.scrollView
                .addChild(pev);
        };
        PropertyView.TEMPLATE = '' +
            '<div class="scrollView">' +
            '</div>';
        //
        PropertyView.style = (function () {
            timelineFlash.Style.add({
                ".scrollView": {
                    position: "relative",
                    width: "100%",
                    minHidth: "100%"
                }
            });
            return;
        })();
        return PropertyView;
    }(timelineFlash.View));
    timelineFlash.PropertyView = PropertyView;
    /**
     *
     */
    var PropertyElementView = (function (_super) {
        __extends(PropertyElementView, _super);
        function PropertyElementView(jq) {
            var _this = this;
            _super.call(this, jq);
            this.jq.on("change", "input", function (e) {
                var target = $(e.target);
                var name = target.attr("name");
                var val = target.val();
                var path = name.split(".");
                var obj = _this.option;
                var i = 0;
                for (i; i < path.length - 1; i++) {
                    obj = obj[path[i]];
                }
                obj[path[i]] = val;
                _this.instance.changeProperty(path[0], val, _this.option);
            });
        }
        /**
         *
         * @param instance
         * @param option
         * @returns {timelineFlash.PropertyElementView}
         */
        PropertyElementView.prototype.reset = function (instance, option) {
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
            function hoge(target, name, val, template) {
                target.attr("data-before", name.split(".").pop());
                for (var i in val) {
                    // ignore
                    if (i == "timelineFlashPosition")
                        continue;
                    var _val = val[i];
                    switch (typeof _val) {
                        case "object":
                            var _target = $("<ul></ul>");
                            target.append(_target);
                            hoge(_target, name + "." + i, _val, template);
                            break;
                        default:
                            var ele = $(document.importNode(template[0]["content"], true));
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
        };
        PropertyElementView.style = (function () {
            timelineFlash.Style.add({
                ".PropView": {
                    "label": {
                        display: "flex",
                        justifyContent: "space-between",
                        "input": {
                            color: timelineFlash.Style.color_reverse
                        }
                    },
                    ul: {
                        paddingLeft: "1rem",
                        "&:before": {
                            content: "attr(data-before)",
                            display: "block",
                            marginLeft: "-1rem",
                            color: "#fff"
                        }
                    }
                }
            });
            return;
        })();
        return PropertyElementView;
    }(timelineFlash.View));
    timelineFlash.PropertyElementView = PropertyElementView;
})(timelineFlash || (timelineFlash = {}));
/// <reference path="../libs.d.ts" />
var timelineFlash;
(function (timelineFlash) {
    var Panel = (function (_super) {
        __extends(Panel, _super);
        function Panel() {
            var _this = this;
            _super.call(this, $('' +
                '<div class="Panel">' +
                '	<div class="MenuBarView">' +
                '	</div>' +
                '	<div class="box">' +
                '		<div class="timelinesView">' +
                '		</div>' +
                '		<div class="PropertyView">' +
                '		</div>' +
                '	</div>' +
                '</div>'));
            //dev
            console = window.opener.console;
            this.uid = $("body").data("id");
            $("body").append(this.jq);
            console.log("Panel");
            Panel.instance = this;
            this.menuBarView = new timelineFlash.MenuBarView(this.jq.find(".MenuBarView"));
            this.propertyView = new timelineFlash.PropertyView(this.jq.find(".PropertyView"));
            this.timelinesView = new timelineFlash.View(this.jq.find(".timelinesView"));
            //
            $(window).on("resize", function () { return _this.resize(); });
            this.resize();
            window.opener["TimelineFlash"].instance.connect(this);
            this.timelines = window.opener["TimelineFlash"].instance.timelines;
            console.log(this.timelines);
            for (var i in this.timelines) {
                console.log(i, this.timelines[i]);
                this.add(this.timelines[i]);
            }
            this.update();
        }
        Panel.prototype.resize = function () {
        };
        Panel.prototype.update = function () {
            var _this = this;
            try {
                if (window.opener["TimelineFlash"].instance.uid != this.uid) {
                    self.close();
                    return;
                }
            }
            catch (e) {
                self.close();
                return;
            }
            window.requestAnimationFrame(function () { return _this.update(); });
        };
        Panel.prototype.add = function (timeline) {
            console.log("Panel", timeline);
            var timelineView = new timelineFlash.TimelineView(timeline);
            this.timelinesView.addChild(timelineView);
        };
        Panel.style = (function () {
            timelineFlash.Style.add({
                ".Panel": {
                    width: "100%",
                    height: "100%",
                    backgroundColor: timelineFlash.Style.color_base,
                    ".MenuBarView": {
                        height: "22px",
                        width: "100%"
                    },
                    ".box": {
                        display: "flex",
                        ".PropertyView": {
                            minWidth: "300px"
                        },
                        ".timelinesView": {
                            flexGrow: 1
                        }
                    }
                }
            });
            return;
        })();
        return Panel;
    }(timelineFlash.View));
    timelineFlash.Panel = Panel;
})(timelineFlash || (timelineFlash = {}));
$(function () {
    new timelineFlash.Panel();
});
/// <reference path="../libs.d.ts" />
var timelineFlash;
(function (timelineFlash) {
    var MenuBarView = (function (_super) {
        __extends(MenuBarView, _super);
        //
        function MenuBarView(jq) {
            var _this = this;
            _super.call(this, jq.append(MenuBarView.TEMPLATE));
            this.jq.on("click", ".exportBtn", function () {
                var str = _this.export();
                console.log(str);
                alert(str);
            });
        }
        /**
         *
         * @returns {string}
         */
        MenuBarView.prototype.export = function () {
            var timelinesView = timelineFlash.Panel.instance.timelinesView;
            var list;
            var resultArr = [];
            var option;
            var arr;
            list = timelinesView.jq.children();
            for (var i = 0; i < list.length; i++) {
                var tlView = $(list[i]).data("instance");
                if (tlView) {
                    option = tlView.timeline["timelineFlashOption"];
                    // console.log(tlView.timeline);
                    // label
                    var label = (option && option.label) ? option.label : 'tl';
                    // set timeline option
                    var tlOption = "";
                    var varsObj = tlView.timeline.vars;
                    arr = [];
                    for (var key in varsObj) {
                        if (key.indexOf("onStart") >= 0
                            || key.indexOf("onUpdate") >= 0
                            || key.indexOf("onComplete") >= 0)
                            continue;
                        arr.push(toKeyValue(key, varsObj[key]));
                    }
                    if (tlView._onStart)
                        arr.push(toKeyValue("onStart", tlView._onStart.toString()));
                    if (tlView._onUpdate)
                        arr.push(toKeyValue("onUpdate", tlView._onUpdate.toString()));
                    if (tlView._onComplete)
                        arr.push(toKeyValue("onComplete", tlView._onComplete.toString()));
                    if (arr.length) {
                        tlOption = '{\n' + arr.join('\n,') + '\n}';
                    }
                    resultArr.push('var ' + label + '=TimelineMax(' + tlOption + ')');
                    // set tween
                    var time = 0;
                    var tlChild = tlView.tweensView.jq.children();
                    for (var n = 0; n < tlChild.length; n++) {
                        var twView = $(tlChild[n]).data("instance");
                        var varsObj = twView.tween.vars;
                        var startTime = twView.tween.startTime();
                        var duration = twView.tween.duration();
                        // console.log(twView.tween);
                        // set method
                        var _method = twView.methodType;
                        // set target
                        var _target;
                        try {
                            for (var key in option.targets) {
                                if (twView.tween["target"] == option.targets[key]) {
                                    _target = key;
                                    break;
                                }
                            }
                        }
                        catch (e) {
                            _target = '$("' + twView.tween["target"].selector + '")';
                        }
                        // set vars
                        var _vars;
                        arr = [];
                        for (var key in varsObj) {
                            if (key == "timelineFlashPosition"
                                || (_method == "from" && (key == "runBackwards" || key == "immediateRender"))
                                || (_method == "fromTo" && (key == "startAt" || key == "immediateRender"))
                                || (_method == "set" && (key == "immediateRender"))) {
                                continue;
                            }
                            arr.push(toKeyValue(key, varsObj[key]));
                        }
                        _vars = ',{' + arr.join(',') + '}';
                        if (varsObj.startAt) {
                            arr = [];
                            for (var key in varsObj.startAt) {
                                arr.push(key + ':' + '"' + varsObj.startAt[key] + '"');
                            }
                            _vars = ',{' + arr.join(',') + '}' + _vars;
                        }
                        // position
                        var _position = varsObj.timelineFlashPosition;
                        // absolute
                        if (typeof (_position) == "number") {
                            _position = ',' + startTime;
                        }
                        else {
                            var v = startTime - time;
                            if (v == 0) {
                                _position = '';
                            }
                            else if (v < 0) {
                                _position = ',"-=' + Math.abs(v) + '"';
                            }
                            else {
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
            function toKeyValue(key, val) {
                if (typeof val != "boolean"
                    && typeof val != "number"
                    && val.indexOf("function") != 0) {
                    val = '"' + val + '"';
                }
                return key + ':' + val;
            }
        };
        MenuBarView.TEMPLATE = '' +
            '<div class="left">' +
            '	<a class="exportBtn Btn">Export</a>' +
            // '	<a class="Btn">remove</a>' +
            '</div>';
        MenuBarView.style = (function () {
            timelineFlash.Style.add({
                ".MenuBarView": {
                    position: "relative",
                    ".left": {
                        ".exportBtn": {}
                    }
                }
            });
            return;
        })();
        return MenuBarView;
    }(timelineFlash.View));
    timelineFlash.MenuBarView = MenuBarView;
})(timelineFlash || (timelineFlash = {}));
/// <reference path="../libs.d.ts" />
var timelineFlash;
(function (timelineFlash) {
    var ToolBarView = (function (_super) {
        __extends(ToolBarView, _super);
        function ToolBarView(jq) {
            _super.call(this, jq.append(ToolBarView.TEMPLATE));
            this.addTweenBtn = this.jq.find(".addTweenBtn")
                .on("click", function () {
            });
            this.removeTweenBtn = this.jq.find(".removeTweenBtn")
                .on("click", function () {
            });
        }
        ToolBarView.TEMPLATE = '' +
            '<div class="leftView">' +
            '	<button class="addTweenBtn">\uff0b</button>' +
            '	<button class="removeTweenBtn">\u2212</button>' +
            '</div>';
        ToolBarView.style = (function () {
            timelineFlash.Style.add({
                ".ToolBarView": {
                    position: "relative",
                    ".leftView": {
                        ".addTweenBtn": {}
                    }
                }
            });
            return;
        })();
        return ToolBarView;
    }(timelineFlash.View));
    timelineFlash.ToolBarView = ToolBarView;
})(timelineFlash || (timelineFlash = {}));
/// <reference path="../libs.d.ts" />
var timelineFlash;
(function (timelineFlash) {
    var RulerView = (function (_super) {
        __extends(RulerView, _super);
        function RulerView(jq) {
            _super.call(this, jq);
            this.labelViews = [];
            this.update();
        }
        RulerView.prototype.update = function () {
            var count = 5;
            var labelView;
            while (true) {
                labelView = this.labelViews[count];
                if (!labelView) {
                    labelView = new timelineFlash.View("labelView");
                    labelView.jq
                        .html(count + "");
                    this.addChild(labelView);
                    this.labelViews[count] = labelView;
                }
                count += 5;
                if (count > 100)
                    break;
            }
        };
        RulerView.style = (function () {
            timelineFlash.Style.add({
                ".RulerView": {
                    position: "relative",
                    overflow: "hidden",
                    width: "100%",
                    height: "22px",
                    paddingLeft: "2.5%",
                    boxSizing: "content-box",
                    ".labelView": {
                        fontSize: "10px",
                        display: "inline-block",
                        textAlign: "center",
                        color: "#fff",
                        width: "5%"
                    }
                }
            });
            return;
        })();
        return RulerView;
    }(timelineFlash.View));
    timelineFlash.RulerView = RulerView;
})(timelineFlash || (timelineFlash = {}));
/// <reference path="../libs.d.ts" />
var timelineFlash;
(function (timelineFlash) {
    var TimelineView = (function (_super) {
        __extends(TimelineView, _super);
        function TimelineView(timeline) {
            var _this = this;
            _super.call(this, $(TimelineView.TEMPLATE));
            this.timeline = timeline;
            this.labelsView = new timelineFlash.View(this.jq.find(".labelsView"));
            this.timelineLabelView = new timelineFlash.View(this.jq.find(".timelineLabelView"));
            this.scrollView = new timelineFlash.View(this.jq.find(".scrollView"));
            this.rulerView = new timelineFlash.RulerView(this.jq.find(".RulerView"));
            this.toolBarView = new timelineFlash.ToolBarView(this.jq.find(".toolBarView"));
            this.tweensView = new timelineFlash.View(this.jq.find(".tweensView"));
            this.seekBarView = new timelineFlash.View(this.jq.find(".seekBarView"));
            this.playBtn = new timelineFlash.View(this.jq.find(".playBtn"));
            this.stopBtn = new timelineFlash.View(this.jq.find(".stopBtn"));
            //
            this.createTweenLine(this.timeline["_first"]);
            // events
            var _onStart = this._onStart = this.timeline["_onStart"];
            var _onUpdate = this._onUpdate = this.timeline["_onUpdate"];
            var _onComplete = this._onComplete = this.timeline["_onComplete"];
            this.timeline
                .eventCallback("onUpdate", function () {
                if (_onUpdate)
                    _onUpdate.call(_this.timeline);
                _this.onUpdate();
            });
            this.playBtn.jq.on("click", function () {
                console.log("playBtn");
                _this.timeline.play();
            });
            this.stopBtn.jq.on("click", function () {
                _this.timeline.pause();
            });
            this.setAction();
            this.setLabel();
            // complete
            // this.onUpdate();
        }
        TimelineView.prototype.createTweenLine = function (tween) {
            var tweenView = new timelineFlash.TweenView(tween);
            this.tweensView.addChild(tweenView);
            this.labelsView.addChild(tweenView.labelView);
            try {
                this.createTweenLine(tween["_next"]);
            }
            catch (e) {
            }
        };
        /**
         *
         */
        TimelineView.prototype.setAction = function () {
            var _this = this;
            var mode = "none";
            var pageX;
            var ratio;
            var currentTime;
            //
            this.seekBarView.jq
                .on("touchstart mousedown", function (e) {
                mode = "down";
                pageX = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
                currentTime = _this.timeline.time();
                ratio = 100 / _this.scrollView.jq.find(".scaleView").width();
            });
            $(window)
                .on("touchmove mousemove", function (e) {
                if (mode == "none")
                    return;
                var _pageX = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
                var deffTime = (pageX - _pageX) * ratio;
                currentTime -= deffTime;
                _this.timeline.time(currentTime > 0 ? currentTime : 0);
                pageX = _pageX;
            })
                .on("touchend mouseup", function (e) {
                if (mode == "none")
                    return;
                mode = "none";
            });
            this.rulerView.jq.on("touchstart mousedown", function (e) {
                console.log(e);
                pageX = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
                pageX -= _this.scrollView.jq.offset().left;
                pageX += _this.scrollView.jq.scrollLeft();
                ratio = 100 / _this.scrollView.jq.find(".scaleView").width();
                _this.timeline.pause();
                _this.timeline.time(pageX * ratio);
            });
        };
        TimelineView.prototype.setLabel = function () {
            var option = this.timeline["timelineFlashOption"];
            var _target = "";
            try {
                _target = option.label;
            }
            catch (e) {
            }
            this.timelineLabelView.jq.find(".name").html(_target);
        };
        TimelineView.prototype.onUpdate = function () {
            this.seekBarView.jq.css("left", this.timeline.time() + "%");
        };
        TimelineView.NAME = "TimelineView";
        TimelineView.TEMPLATE = '' +
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
        TimelineView.style = (function () {
            timelineFlash.Style.add({
                ".TimelineView": {
                    display: "flex",
                    minHeight: "44px",
                    backgroundColor: "#444444",
                    ".left": {
                        display: "flex",
                        flexDirection: "column",
                        borderRight: "1px solid #2b2b2b",
                        ".timelineLabelView": {
                            display: "flex",
                            height: "22px",
                            color: "#fff",
                            ".name": {
                                flexGrow: 1
                            }
                        },
                        ".labelsView": {
                            minWidth: "300px",
                            flexGrow: 1
                        },
                        ".ToolBarView": {}
                    },
                    ".scrollView": {
                        flexGrow: 1,
                        overflowX: "scroll",
                        ".scaleView": {
                            position: "relative",
                            minWidth: "100%",
                            width: "500%",
                            ".seekBarView": {
                                position: "absolute",
                                top: "22px",
                                left: "0px",
                                width: "1px",
                                height: "calc(100% - 22px)",
                                borderLeft: "1px solid #B20200",
                                "&:before": {
                                    content: "''",
                                    display: "block",
                                    position: "absolute",
                                    top: "-22px",
                                    left: "-5px",
                                    width: "10px",
                                    height: "22px",
                                    backgroundColor: "rgba(178,2,0,0.4)",
                                    border: "1px solid #B20200"
                                }
                            }
                        }
                    },
                    ".PropertyView": {}
                }
            });
            return;
        })();
        return TimelineView;
    }(timelineFlash.View));
    timelineFlash.TimelineView = TimelineView;
})(timelineFlash || (timelineFlash = {}));
/// <reference path="../libs.d.ts" />
var timelineFlash;
(function (timelineFlash) {
    var TweenView = (function (_super) {
        __extends(TweenView, _super);
        function TweenView(tween) {
            _super.call(this, $(TweenView.TEMPLATE));
            this.tween = tween;
            //
            this.frameView = new timelineFlash.View(this.jq.find(".frameView"));
            this.leftNobView = new timelineFlash.View(this.jq.find(".leftNobView"));
            this.rightNobView = new timelineFlash.View(this.jq.find(".rightNobView"));
            this.labelView = new timelineFlash.View($(TweenView.LABEL_TEMPLATE));
            //
            // set method
            var varsObj = this.tween.vars;
            if (varsObj.runBackwards && varsObj.immediateRender) {
                this.methodType = "from";
            }
            else if (varsObj.startAt) {
                this.methodType = "fromTo";
            }
            else if (this.tween.duration() == 0 && varsObj.immediateRender == false) {
                this.methodType = "set";
            }
            else {
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
        TweenView.prototype.setAction = function () {
            var _this = this;
            var mode = "none";
            var pageX;
            var ratio;
            var startTime;
            var duration;
            var timeScale;
            //
            var comm = function (e) {
                pageX = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
                startTime = _this.tween.startTime();
                duration = _this.tween.duration();
                timeScale = _this.tween.timeScale();
                ratio = 100 / _this.jq.width();
                // ratio = startTime / parseInt(this.frameView.jq.css("marginLeft")) || 1;
                onSelect();
            };
            var onSelect = function () {
                $(".frameView.selected,.TimelineView .LabelView").removeClass("selected");
                _this.frameView.jq.addClass("selected");
                _this.labelView.jq.addClass("selected");
            };
            this.frameView.jq
                .on("touchstart mousedown", function (e) {
                if (mode != "none")
                    return;
                mode = "move";
                comm(e);
            });
            this.leftNobView.jq
                .on("touchstart mousedown", function (e) {
                mode = "start";
                comm(e);
            });
            this.rightNobView.jq
                .on("touchstart mousedown", function (e) {
                mode = "duration";
                comm(e);
            });
            this.labelView.jq.on("touchstart mousedown", function (e) { return onSelect(); });
            $(window)
                .on("touchmove mousemove", function (e) {
                if (mode == "none")
                    return;
                var _pageX = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
                var deffTime = (pageX - _pageX) * ratio;
                if (mode != "duration")
                    startTime -= deffTime;
                if (mode == "start")
                    duration += deffTime;
                if (mode == "duration")
                    duration -= deffTime;
                _this.frameView.jq.css({
                    marginLeft: startTime + "%",
                    width: (duration * timeScale) + "%"
                });
                pageX = _pageX;
            })
                .on("touchend mouseup", function (e) {
                if (mode == "none")
                    return;
                mode = "none";
                _this.tween.startTime(startTime);
                _this.tween.duration(duration);
                _this.update();
            });
        };
        /**
         *
         */
        TweenView.prototype.setLabel = function () {
            var option = this.tween.timeline["timelineFlashOption"];
            var _target;
            try {
                for (var key in option.targets) {
                    if (this.tween["target"] == option.targets[key]) {
                        _target = key;
                        break;
                    }
                }
            }
            catch (e) {
                _target = this.tween["target"].selector;
            }
            this.labelView.jq.find(".name").html(_target);
        };
        TweenView.prototype.update = function () {
            var startTime = this.tween.startTime();
            var duration = this.tween.duration();
            var timeScale = this.tween.timeScale();
            this.frameView.jq.css({
                marginLeft: startTime + "%",
                width: (duration * timeScale) + "%"
            });
        };
        //---prop
        TweenView.prototype.getPropertyElement = function () {
            return TweenView.PROPERTY_ELEMENT_VIEW.reset(this, {
                selector: this.tween["target"].selector,
                startTime: this.tween.startTime(),
                duration: this.tween.duration(),
                timeScale: this.tween.timeScale(),
                vars: this.tween.vars
            });
        };
        TweenView.prototype.changeProperty = function (name, val, option) {
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
        };
        TweenView.NAME = "TweenView";
        TweenView.TEMPLATE = '' +
            '<div class="TweenView">' +
            '	<div class="frameView">' +
            '		<div class="leftNobView">' +
            '		</div>' +
            '		<div class="rightNobView">' +
            '		</div>' +
            '	</div>' +
            '</div>';
        TweenView.LABEL_TEMPLATE = '' +
            '<div class="LabelView">' +
            '	<span class="name">' +
            '	</span>' +
            '</div>';
        TweenView.PROPERTY_ELEMENT_VIEW = new timelineFlash.PropertyElementView($('' +
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
        TweenView.style = (function () {
            timelineFlash.Style.add({
                ".TweenView": {
                    position: "relative",
                    height: "22px",
                    width: "100%",
                    backgroundColor: "#494949",
                    borderBottom: timelineFlash.Style.border_dark,
                    ".frameView": {
                        position: "relative",
                        height: "100%",
                        backgroundColor: "#62668A",
                        borderLeft: timelineFlash.Style.border_dark,
                        borderRight: timelineFlash.Style.border_dark,
                        "&.selected": {
                            backgroundColor: timelineFlash.Style.color_select
                        },
                        ".leftNobView,.rightNobView": {
                            position: "absolute",
                            width: "10px",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            "&:before": {
                                content: "''",
                                display: "block",
                                width: "5px",
                                height: "5px",
                                marginLeft: "2.5px",
                                borderRadius: "50%",
                                backgroundColor: timelineFlash.Style.color_reverse
                            }
                        },
                        ".leftNobView": {
                            left: 0
                        },
                        ".rightNobView": {
                            right: 0
                        }
                    },
                    "&[data-method='set']": {
                        ".frameView .rightNobView": {
                            display: "none"
                        }
                    },
                    "&[data-method='to']": {
                        ".frameView .leftNobView:before": {
                            backgroundColor: "transparent",
                            border: "1px solid " + timelineFlash.Style.color_reverse.getCode()
                        }
                    },
                    "&[data-method='from']": {
                        ".frameView .rightNobView:before": {
                            backgroundColor: "transparent",
                            border: "1px solid " + timelineFlash.Style.color_reverse.getCode()
                        }
                    }
                },
                ".TimelineView .left .LabelView": {
                    position: "relative",
                    height: "22px",
                    color: "#fff",
                    backgroundColor: "#494949",
                    borderBottom: timelineFlash.Style.border_dark,
                    "&.selected": {
                        backgroundColor: timelineFlash.Style.color_select
                    },
                    "&:after": {
                        marginLeft: "1em",
                        opacity: 0.5
                    },
                    "&[data-method='set']:after": {
                        content: "'-set-'"
                    },
                    "&[data-method='from']:after": {
                        content: "'-from-'"
                    },
                    "&[data-method='fromTo']:after": {
                        content: "'-fromTo-'"
                    },
                    "&[data-method='to']:after": {
                        content: "'-to-'"
                    }
                },
                ".TweenViewProp": {}
            });
            return;
        })();
        return TweenView;
    }(timelineFlash.View));
    timelineFlash.TweenView = TweenView;
})(timelineFlash || (timelineFlash = {}));
/// <reference path="../libs.d.ts" />
var timelineFlash;
(function (timelineFlash) {
    var PropertyObject = (function () {
        function PropertyObject() {
        }
        return PropertyObject;
    }());
    timelineFlash.PropertyObject = PropertyObject;
})(timelineFlash || (timelineFlash = {}));
//# sourceMappingURL=TimelineFlash.js.map