define(['exports', './spotify-connect', './toast'], function (exports, _spotifyConnect, _toast) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _spotifyConnect2 = _interopRequireDefault(_spotifyConnect);

  var _toast2 = _interopRequireDefault(_toast);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

  var Visualizer = function (_SpotifyConnect) {
    _inherits(Visualizer, _SpotifyConnect);

    function Visualizer(demo, interval) {
      _classCallCheck(this, Visualizer);

      var _this = _possibleConstructorReturn(this, (Visualizer.__proto__ || Object.getPrototypeOf(Visualizer)).call(this, demo, interval));

      _this.audio = document.querySelector('audio');
      _this.active = false;
      _this.initialized = false;
      _this.toast = new _toast2.default();
      _this.pinging = false;
      _this.pingInterval = {};
      _this.events = {
        beforeInit: function beforeInit() {},
        afterInit: function afterInit() {},
        beforeStart: function beforeStart() {},
        afterStart: function afterStart() {},
        beforeStop: function beforeStop() {},
        afterStop: function afterStop() {}
      };
      return _this;
    }

    _createClass(Visualizer, [{
      key: 'initializeVisualizer',
      value: function initializeVisualizer() {
        var _this2 = this;

        this.getCurrentlyPlaying().then(function (response) {
          return _this2.processResponse(response);
        }).catch(function (err) {
          return console.log(err);
        });
      }
    }, {
      key: 'startVisualizer',
      value: function startVisualizer() {
        this.toast.nowPlaying({
          title: this.currentlyPlaying.item.name,
          album: this.currentlyPlaying.item.album.name,
          artist: this.currentlyPlaying.item.artists[0].name,
          artwork: this.currentlyPlaying.item.album.images[0].url
        });

        if (this.initialized === false) {
          this.events.beforeInit.bind(this).call();
          this.initialized = true;
          this.events.afterInit.bind(this).call();
        }

        this.events.beforeStart.bind(this).call();
        this.setIntervalHooks();
        this.initializeHooks();
        this.active = true;
        this.events.afterStart.bind(this).call();
      }
    }, {
      key: 'startVisualizerDemo',
      value: function startVisualizerDemo() {
        var _this3 = this;

        this.audio.src = '/data/song.mp3';
        this.audio.play();

        var canPlayThrough = function canPlayThrough() {
          _this3.trackProgress = {
            progress: _this3.audio.currentTime * 100,
            timestamp: window.performance.now()
          };
          _this3.startVisualizer();
          _this3.audio.removeEventListener('canplaythrough', canPlayThrough);
        };

        this.audio.addEventListener('canplaythrough', canPlayThrough);
      }
    }, {
      key: 'stopVisualizer',
      value: function stopVisualizer() {
        this.events.beforeStop.bind(this).call();
        this.removeHooks();
        this.updateTrackProgress(0, true);
        this.active = false;
        this.events.afterStop.bind(this).call();
      }
    }, {
      key: 'processResponse',
      value: function processResponse(response) {
        var _this4 = this;

        if (!response.item) {
          this.toast.notPlaying();

          if (this.active) {
            this.stopVisualizer();
          }

          return;
        }

        var getData = function getData(timestamp) {
          clearInterval(_this4.pingInterval);
          Promise.all([_this4.getTrackFeatures(), _this4.getTrackAnalysis()]).then(function (responses) {
            _this4.trackFeatures = responses[0];
            _this4.trackAnalysis = responses[1];
            _this4.updateTrackProgress(response.delay + (window.performance.now() - timestamp));
            if (_this4.demo === true) {
              _this4.startVisualizerDemo();
            } else {
              _this4.startVisualizer();
              _this4.startPing();
            }
          });
        };

        if (this.active) {
          if (response.is_playing === false) {
            this.stopVisualizer();
            this.toast.notPlaying();
            if (!this.pinging) {
              this.startPing();
            }
            return;
          }

          if (JSON.stringify(this.currentlyPlaying.item) !== JSON.stringify(response.item)) {
            this.stopVisualizer();
            this.currentlyPlaying = response;
            getData(window.performance.now());
            return;
          }
        }

        if (!this.active && response.is_playing === false) {
          this.toast.notPlaying();
        }

        if (!this.active && response.is_playing === true) {
          this.currentlyPlaying = response;
          getData(window.performance.now());
        }

        if (!this.pinging && !this.demo) {
          this.startPing();
        }
      }
    }, {
      key: 'startPing',
      value: function startPing() {
        var _this5 = this;

        clearInterval(this.pingInterval);
        this.pingInterval = setInterval(function () {
          console.log('Ping...');
          _this5.getCurrentlyPlaying().then(function (response) {
            return _this5.processResponse(response);
          }).catch(function (err) {
            return console.log(err);
          });
        }, 5000);
      }
    }]);

    return Visualizer;
  }(_spotifyConnect2.default);

  exports.default = Visualizer;
});
//# sourceMappingURL=visualizer.js.map
