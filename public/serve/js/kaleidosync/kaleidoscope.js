define(['exports', './visualizer', './canvas', './star', './rectangle'], function (exports, _visualizer, _canvas, _star, _rectangle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _visualizer2 = _interopRequireDefault(_visualizer);

  var _canvas2 = _interopRequireDefault(_canvas);

  var _star2 = _interopRequireDefault(_star);

  var _rectangle2 = _interopRequireDefault(_rectangle);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)];
  };

  var Kaleidoscope = function (_Visualizer) {
    _inherits(Kaleidoscope, _Visualizer);

    function Kaleidoscope(demo, interval) {
      _classCallCheck(this, Kaleidoscope);

      var _this = _possibleConstructorReturn(this, (Kaleidoscope.__proto__ || Object.getPrototypeOf(Kaleidoscope)).call(this, demo, interval));

      _this.interval = interval;
      _this.intervalTimeout = _this.interval ? {} : false;
      _this.canvas = new _canvas2.default('kaleidoscope');
      _this.totalStars = 16;
      _this.maxSize = (_this.canvas.isMobile ? 1.2 : .5) * (window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth);
      _this.minSize = _this.maxSize / 5;
      _this.activeSize = _this.intervalTimeout !== false ? _this.maxSize : _this.minSize;
      _this.sizeStep = [_this.maxSize / _this.totalStars * 0.4, _this.maxSize / _this.totalStars * 0.6, _this.maxSize / _this.totalStars * 0.8];
      _this.radiusStep = [.1, .2, .3, .4, .5, .6, .7, .8, .9, 1, 1.1, 1.2];
      _this.colorSchemes = [['rgb(255,159,28)', 'rgb(255,191,105)', 'rgb(203,243,240)', 'rgb(46,196,182)', 'rgb(255,255,255)'], ['rgb(229,99,153)', 'rgb(210,241,228)', 'rgb(251,202,239)', 'rgb(72,48,77)', 'rgb(255,255,255)'], ['rgb(198,0,66)', 'rgb(255,119,168)', 'rgb(226,206,239)', 'rgb(255,198,217)', 'rgb(255,255,255)'], ['rgb(118,229,252)', 'rgb(27,154,170)', 'rgb(157,172,255)', 'rgb(61,52,139)', 'rgb(238,251,255)'], ['rgb(10,36,99)', 'rgb(62,146,204)', 'rgb(255,250,255)', 'rgb(216,49,91)', 'rgb(39,27,24)']];
      _this.duration = 6000;
      _this.radiusDuration = _this.duration;
      _this.colorDuration = _this.duration;
      _this.backgroundDuration = _this.duration;
      _this.refreshRate = 1000 / 60;

      _this.model = {
        stars: {
          last: [],
          active: []
        },
        background: {
          last: {},
          active: {}
        }
      };

      var colors = _this.colorSchemes.randomElement(),
          negative = colors.randomElement(),
          negArray = [negative, negative, negative, negative];

      _this.activeColorScheme = colors.concat(negArray);

      if (_this.demo === true) {
        if (_this.interval !== true) {
          _this.setEventHooks();
          _this.initializeVisualizer();
        } else {
          _this.buildSingleState(true);
        }
      } else {
        _this.setEventHooks();
        _this.initializeVisualizer();
      }
      return _this;
    }

    _createClass(Kaleidoscope, [{
      key: 'initElements',
      value: function initElements() {
        if (this.initialized === true) {
          return;
        }

        for (var i = 0; i < this.totalStars; i++) {
          var numPoints = 16;

          if ((i + 1) % 2 === 0) numPoints = 24;
          if ((i + 1) % 3 === 0) numPoints = 8;
          if ((i + 1) % 4 === 0) numPoints = 32;

          var starState = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            points: numPoints,
            color: 'rgb(255,255,255)',
            innerRadius: 0,
            outerRadius: 0
          };

          var star = new _star2.default(starState);

          this.model.stars.active[i] = starState;
          this.model.stars.last[i] = starState;

          this.canvas.addStar(star);
        }

        var backgroundState = {
          color: 'rgb(255,255,255)',
          width: this.canvas.width,
          height: this.canvas.height
        };

        this.model.background.active = backgroundState;
        this.model.background.last = backgroundState;

        this.canvas.addBackground(new _rectangle2.default(backgroundState));

        this.canvas.init();

        this.initialized = true;
      }
    }, {
      key: 'setRadiusState',
      value: function setRadiusState() {
        var size = this.activeSize;

        for (var i = 0; i < this.totalStars; i++) {
          size = parseInt(size - this.sizeStep.randomElement());

          if (size < this.minSize) {
            size = this.minSize;
          }

          clearInterval(this.canvas.stars[i].radiusTween);

          this.model.stars.last[i].innerRadius = this.model.stars.active[i].innerRadius;
          this.model.stars.last[i].outerRadius = this.model.stars.active[i].outerRadius;

          this.model.stars.active[i].innerRadius = size * this.radiusStep.randomElement();
          this.model.stars.active[i].outerRadius = size;
        }
      }
    }, {
      key: 'setColorState',
      value: function setColorState() {
        for (var i = 0; i < this.totalStars; i++) {
          clearInterval(this.canvas.stars[i].colorTween);

          this.model.stars.last[i] = _extends({}, this.model.stars.last[i], {
            color: this.model.stars.active[i].color
          });

          this.model.stars.active[i].color = this.activeColorScheme.randomElement();
        }
      }
    }, {
      key: 'setBackgroundState',
      value: function setBackgroundState(negative) {
        this.model.background.last = _extends({}, this.model.background.last, {
          color: this.model.background.active.color
        });

        this.model.background.active = _extends({}, this.model.background.active, {
          color: negative
        });
      }
    }, {
      key: 'tweenStarRadius',
      value: function tweenStarRadius(ms) {
        var _this2 = this;

        var duration = ms ? ms : this.radiusDuration;

        var _loop = function _loop(i) {
          var star = _this2.canvas.stars[i];

          var nextState = _this2.model.stars.active[i],
              lastState = _this2.model.stars.last[i];

          var innerRadiusStep = (nextState.innerRadius - lastState.innerRadius) / (duration / _this2.refreshRate),
              outerRadiusStep = (nextState.outerRadius - lastState.outerRadius) / (duration / _this2.refreshRate);

          var tweeningInnerRadius = lastState.innerRadius,
              tweeningOuterRadius = lastState.outerRadius;

          star.radiusTween = setInterval(function () {
            tweeningInnerRadius = tweeningInnerRadius + innerRadiusStep;
            tweeningOuterRadius = tweeningOuterRadius + outerRadiusStep;

            nextState.innerRadius = tweeningInnerRadius;
            nextState.outerRadius = tweeningOuterRadius;

            star.update({
              innerRadius: tweeningInnerRadius,
              outerRadius: tweeningOuterRadius
            });
          }, _this2.refreshRate);
        };

        for (var i = 0; i < this.totalStars; i++) {
          _loop(i);
        }
      }
    }, {
      key: 'tweenStarColor',
      value: function tweenStarColor(ms) {
        var _this3 = this;

        var duration = ms ? ms : this.colorDuration;

        var _loop2 = function _loop2(i) {
          var nextColor = _this3.model.stars.active[i].color.slice(4, -1).split(','),
              lastColor = _this3.model.stars.last[i].color.slice(4, -1).split(',');

          var stepR = (parseInt(nextColor[0]) - parseInt(lastColor[0])) / (duration / _this3.refreshRate),
              stepG = (parseInt(nextColor[1]) - parseInt(lastColor[1])) / (duration / _this3.refreshRate),
              stepB = (parseInt(nextColor[2]) - parseInt(lastColor[2])) / (duration / _this3.refreshRate);

          var tweenR = parseInt(lastColor[0]),
              tweenG = parseInt(lastColor[1]),
              tweenB = parseInt(lastColor[2]);

          _this3.canvas.stars[i].colorTween = setInterval(function () {
            tweenR = parseInt(tweenR + stepR);
            tweenG = parseInt(tweenG + stepG);
            tweenB = parseInt(tweenB + stepB);

            var color = 'rgb(' + tweenR + ', ' + tweenG + ', ' + tweenB + ')';

            _this3.model.stars.active[i].color = color;

            _this3.canvas.stars[i].update({ color: color });
          }, _this3.refreshRate);
        };

        for (var i = 0; i < this.totalStars; i++) {
          _loop2(i);
        }
      }
    }, {
      key: 'tweenBackgroundColor',
      value: function tweenBackgroundColor(ms) {
        var _this4 = this;

        var duration = ms ? ms : this.backgroundDuration;

        var nextColor = this.model.background.active.color.slice(4, -1).split(','),
            lastColor = this.model.background.last.color.slice(4, -1).split(',');

        var stepR = (parseInt(nextColor[0]) - parseInt(lastColor[0])) / (duration / this.refreshRate),
            stepG = (parseInt(nextColor[1]) - parseInt(lastColor[1])) / (duration / this.refreshRate),
            stepB = (parseInt(nextColor[2]) - parseInt(lastColor[2])) / (duration / this.refreshRate);

        var tweenR = parseInt(lastColor[0]),
            tweenG = parseInt(lastColor[1]),
            tweenB = parseInt(lastColor[2]);

        this.canvas.background.tweenInterval = setInterval(function () {
          tweenR = parseInt(tweenR + stepR);
          tweenG = parseInt(tweenG + stepG);
          tweenB = parseInt(tweenB + stepB);

          var color = 'rgb(' + tweenR + ', ' + tweenG + ', ' + tweenB + ')';

          _this4.model.background.active.color = color;

          _this4.canvas.background.update({ color: color });
        }, this.refreshRate);
      }
    }, {
      key: 'setActiveColorScheme',
      value: function setActiveColorScheme(ms) {
        clearInterval(this.canvas.background.tweenInterval);

        var colors = ms ? this.colorSchemes[0] : this.colorSchemes.randomElement(),
            negative = colors.randomElement(),
            negArray = [negative, negative, negative, negative];

        this.activeColorScheme = colors.concat(negArray);
        this.setBackgroundState(negative);
      }
    }, {
      key: 'clearTweeningIntervals',
      value: function clearTweeningIntervals() {
        for (var i = 0; i < this.totalStars; i++) {
          clearInterval(this.canvas.stars[i].radiusTween);
          clearInterval(this.canvas.stars[i].colorTween);
        }

        clearInterval(this.canvas.background.tweenInterval);
      }
    }, {
      key: 'buildSingleState',
      value: function buildSingleState(init) {
        var _this5 = this;

        this.activeSize = this.maxSize;

        if (init) {
          this.initElements();
        }

        this.setActiveColorScheme(this.duration);
        this.setColorState();
        this.setRadiusState();

        this.tweenStarRadius(this.duration);
        this.tweenStarColor(this.duration);
        this.tweenBackgroundColor(this.duration);

        if (init) {
          this.buildSingleState();

          if (this.demo === true && this.interval === true) {
            setTimeout(function () {
              _this5.clearTweeningIntervals();
              _this5.canvas.stopPaint();
            }, this.duration);
          }
        }
      }
    }, {
      key: 'setEventHooks',
      value: function setEventHooks() {
        var _this6 = this;

        this.events.beforeInit = function () {
          _this6.initElements();

          if (_this6.interval === true) {
            clearTimeout(_this6.intervalTimeout.timer);
          }
        };

        this.events.afterStop = function () {
          _this6.clearTweeningIntervals();
        };
      }
    }, {
      key: 'setIntervalHooks',
      value: function setIntervalHooks() {
        var _this7 = this;

        var tatums = document.getElementById('tatums');
        var segments = document.getElementById('segments');
        var beats = document.getElementById('beats');
        var bars = document.getElementById('bars');
        var sections = document.getElementById('sections');

        var metrics = false;

        this.intervals.hooks.tatums = function (i) {
          metrics ? tatums.innerHTML = 'TATUM: <i>' + i + '/' + _this7.trackAnalysis.tatums.length + '</i>' : null;
          _this7.radiusDuration = _this7.intervals.active.tatums.duration * 1000;
          _this7.setRadiusState();
          _this7.tweenStarRadius();
        };

        this.intervals.hooks.segments = function (i) {
          metrics ? segments.innerHTML = 'SEGMENT: <i>' + i + '/' + _this7.trackAnalysis.segments.length + '</i>' : null;
          var nextLoudness = _this7.intervals.next.segments ? _this7.intervals.next.segments.loudness_max : _this7.intervals.active.segments.loudness_max,
              lastLoudness = _this7.intervals.last.segments ? _this7.intervals.last.segments.loudness_max : _this7.intervals.active.segments.loudness_max,
              activeLoudness = (_this7.intervals.active.segments.loudness_max + nextLoudness + lastLoudness) / 3;

          _this7.activeSize = _this7.maxSize - activeLoudness * -25 + _this7.trackFeatures.loudness * -10;
        };

        this.intervals.hooks.beats = function (i) {
          metrics ? beats.innerHTML = 'BEAT: <i>' + i + '/' + _this7.trackAnalysis.beats.length + '</i>' : null;
          _this7.colorDuration = _this7.intervals.active.beats.duration * 1000;
          _this7.setColorState();
          _this7.tweenStarColor();
        };

        this.intervals.hooks.bars = function (i) {
          metrics ? bars.innerHTML = 'BAR: <i>' + i + '/' + _this7.trackAnalysis.bars.length + '</i>' : null;
          _this7.backgroundDuration = _this7.intervals.active.bars.duration * 1000;

          _this7.setActiveColorScheme();
          _this7.tweenBackgroundColor();
        };

        this.intervals.hooks.sections = function (i) {
          metrics ? sections.innerHTML = 'SECTION: <i>' + i + '/' + _this7.trackAnalysis.sections.length + '</i>' : null;
        };
      }
    }]);

    return Kaleidoscope;
  }(_visualizer2.default);

  exports.default = Kaleidoscope;
});
//# sourceMappingURL=kaleidoscope.js.map
