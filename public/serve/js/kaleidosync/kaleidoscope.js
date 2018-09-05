define(['exports', './visualizer', './canvas', './star', './rectangle', './colors'], function (exports, _visualizer, _canvas, _star, _rectangle, _colors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _visualizer2 = _interopRequireDefault(_visualizer);

  var _canvas2 = _interopRequireDefault(_canvas);

  var _star2 = _interopRequireDefault(_star);

  var _rectangle2 = _interopRequireDefault(_rectangle);

  var _colors2 = _interopRequireDefault(_colors);

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

    function Kaleidoscope(halt) {
      _classCallCheck(this, Kaleidoscope);

      var _this = _possibleConstructorReturn(this, (Kaleidoscope.__proto__ || Object.getPrototypeOf(Kaleidoscope)).call(this, halt));

      _this.halt = halt;
      _this.canvas = new _canvas2.default('kaleidoscope');
      _this.totalStars = 16;
      _this.maxSize = (_this.canvas.isMobile ? 1.2 : .5) * (window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth);
      _this.minSize = _this.maxSize / 5;
      _this.activeSize = _this.halt ? _this.maxSize : _this.minSize;
      _this.sizeStep = [_this.maxSize / _this.totalStars * 0.4, _this.maxSize / _this.totalStars * 0.6, _this.maxSize / _this.totalStars * 0.8];
      _this.radiusStep = [.1, .2, .3, .4, .5, .6, .7, .8, .9, 1, 1.1, 1.2];
      _this.colorSchemes = _colors2.default;
      _this.activeColorScheme = [];
      _this.duration = 5000;
      _this.radiusDuration = _this.duration;
      _this.colorDuration = _this.duration;
      _this.backgroundDuration = _this.duration;
      _this.refreshRate = 1000 / 60;
      _this.model = {
        stars: { last: [],
          active: []
        },
        background: {
          last: {},
          active: {}
        }
      };

      _this.setEventHooks();

      if (_this.halt === true) {
        _this.buildSingleState(true);
      } else {
        _this.pingSpotify(true);
      }
      return _this;
    }

    _createClass(Kaleidoscope, [{
      key: 'setEventHooks',
      value: function setEventHooks() {
        var _this2 = this;

        this.events.beforeInit = function () {
          _this2.setActiveColorScheme();
          _this2.initElements();
        };

        this.events.beforeStart = function () {
          _this2.canvas.startPaint();
        };

        this.events.afterStop = function () {
          _this2.clearTweeningIntervals();
          _this2.canvas.stopPaint();
        };
      }
    }, {
      key: 'buildSingleState',
      value: function buildSingleState(init) {
        var _this3 = this;

        this.activeSize = this.maxSize;

        if (init) {
          this.initElements();
        }

        this.setActiveColorScheme();
        this.setColorState();
        this.setRadiusState();

        if (!init) {
          this.tweenStarRadius();
          this.tweenStarColor();
          this.tweenBackgroundColor();
        }

        if (init) {
          this.buildSingleState();

          setTimeout(function () {
            _this3.clearTweeningIntervals();
            _this3.canvas.stopPaint();
          }, this.duration);
        }
      }
    }, {
      key: 'initElements',
      value: function initElements() {
        if (this.initialized === true) {
          return;
        }

        for (var i = 0; i < this.totalStars; i++) {
          var numPoints = 16;

          if ((i + 1) % 2 === 0) {
            numPoints = 24;
          }
          if ((i + 1) % 3 === 0) {
            numPoints = 8;
          }
          if ((i + 1) % 4 === 0) {
            numPoints = 32;
          }

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
        clearInterval(this.canvas.background.colorTween);

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
        var _this4 = this;

        var duration = ms ? ms : this.radiusDuration;

        var _loop = function _loop(i) {
          var star = _this4.canvas.stars[i];
          var next = _this4.model.stars.active[i];
          var last = _this4.model.stars.last[i];
          var innerStep = (next.innerRadius - last.innerRadius) / (duration / _this4.refreshRate);
          var outerStep = (next.outerRadius - last.outerRadius) / (duration / _this4.refreshRate);
          var innerTween = last.innerRadius;
          var outerTween = last.outerRadius;

          star.radiusTween = setInterval(function () {
            innerTween = innerTween + innerStep;
            outerTween = outerTween + outerStep;

            next.innerRadius = innerTween;
            next.outerRadius = outerTween;

            if (!isNaN(innerTween)) {
              star.update({
                innerRadius: innerTween,
                outerRadius: outerTween
              });
            } else {
              clearInterval(star.radiusTween);
            }
          }, _this4.refreshRate);
        };

        for (var i = 0; i < this.totalStars; i++) {
          _loop(i);
        }
      }
    }, {
      key: 'tweenRGB',
      value: function tweenRGB(duration, next, last, element, setColor) {
        var stepR = (parseInt(next[0]) - parseInt(last[0])) / (duration / this.refreshRate);
        var stepG = (parseInt(next[1]) - parseInt(last[1])) / (duration / this.refreshRate);
        var stepB = (parseInt(next[2]) - parseInt(last[2])) / (duration / this.refreshRate);

        var tweenR = parseInt(last[0]);
        var tweenG = parseInt(last[1]);
        var tweenB = parseInt(last[2]);

        element.colorTween = setInterval(function () {
          tweenR = parseInt(tweenR + stepR);
          tweenG = parseInt(tweenG + stepG);
          tweenB = parseInt(tweenB + stepB);

          setColor('rgb(' + tweenR + ', ' + tweenG + ', ' + tweenB + ')');
        }, this.refreshRate);
      }
    }, {
      key: 'tweenStarColor',
      value: function tweenStarColor(ms) {
        var _this5 = this;

        var duration = ms ? ms : this.colorDuration;

        var _loop2 = function _loop2(i) {
          var next = _this5.model.stars.active[i].color.slice(4, -1).split(',');
          var last = _this5.model.stars.last[i].color.slice(4, -1).split(',');

          _this5.tweenRGB(duration, next, last, _this5.canvas.stars[i], function (color) {
            _this5.model.stars.active[i].color = color;
            _this5.canvas.stars[i].update({ color: color });
          });
        };

        for (var i = 0; i < this.totalStars; i++) {
          _loop2(i);
        }
      }
    }, {
      key: 'tweenBackgroundColor',
      value: function tweenBackgroundColor(ms) {
        var _this6 = this;

        var duration = ms ? ms : this.backgroundDuration;
        var next = this.model.background.active.color.slice(4, -1).split(',');
        var last = this.model.background.last.color.slice(4, -1).split(',');

        this.tweenRGB(duration, next, last, this.canvas.background, function (color) {
          _this6.model.background.active.color = color;
          _this6.canvas.background.update({ color: color });
        });
      }
    }, {
      key: 'setActiveColorScheme',
      value: function setActiveColorScheme() {
        var colors = this.colorSchemes.randomElement();
        var negative = colors.randomElement();
        var negArray = [negative, negative, negative, negative];

        this.activeColorScheme = colors.concat(negArray);
        this.setBackgroundState(negative);
      }
    }, {
      key: 'clearTweeningIntervals',
      value: function clearTweeningIntervals() {
        if (this.initialized) {
          for (var i = 0; i < this.totalStars; i++) {
            clearInterval(this.canvas.stars[i].radiusTween);
            clearInterval(this.canvas.stars[i].colorTween);
          }

          clearInterval(this.canvas.background.colorTween);
        }
      }
    }, {
      key: 'setIntervalHooks',
      value: function setIntervalHooks() {
        var _this7 = this;

        this.intervals.hooks.tatums = function () {
          _this7.radiusDuration = _this7.intervals.active.tatums.duration * 1000;
          _this7.setRadiusState();
          _this7.tweenStarRadius();
        };

        this.intervals.hooks.segments = function () {
          var nextLoudness = _this7.intervals.next.segments ? _this7.intervals.next.segments.loudness_max : _this7.intervals.active.segments.loudness_max;
          var lastLoudness = _this7.intervals.last.segments ? _this7.intervals.last.segments.loudness_max : _this7.intervals.active.segments.loudness_max;
          var activeLoudness = (_this7.intervals.active.segments.loudness_max + nextLoudness + lastLoudness) / 3;

          _this7.activeSize = _this7.maxSize - activeLoudness * -25 + _this7.trackFeatures.loudness * -10;
        };

        this.intervals.hooks.beats = function () {
          _this7.colorDuration = _this7.intervals.active.beats.duration * 1000;
          _this7.setColorState();
          _this7.tweenStarColor();
        };

        this.intervals.hooks.bars = function () {
          _this7.backgroundDuration = _this7.intervals.active.bars.duration * 1000;
          _this7.setActiveColorScheme();
          _this7.tweenBackgroundColor();
        };
      }
    }]);

    return Kaleidoscope;
  }(_visualizer2.default);

  exports.default = Kaleidoscope;
});
//# sourceMappingURL=kaleidoscope.js.map
