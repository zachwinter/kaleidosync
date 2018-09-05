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

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
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

  var Visualizer = function (_SpotifyConnect) {
    _inherits(Visualizer, _SpotifyConnect);

    function Visualizer() {
      _classCallCheck(this, Visualizer);

      var _this = _possibleConstructorReturn(this, (Visualizer.__proto__ || Object.getPrototypeOf(Visualizer)).call(this));

      _this.active = false;
      _this.initialized = false;
      _this.loadingNext = false;
      _this.toast = new _toast2.default();
      _this.events = {
        beforeInit: function beforeInit() {},
        afterInit: function afterInit() {},
        beforeStart: function beforeStart() {},
        afterStart: function afterStart() {},
        beforeStop: function beforeStop() {},
        afterStop: function afterStop() {}
      };

      _this.onTrackComplete = function () {
        _this.loadingNext = true;
        _this.stopVisualizer();
      };
      return _this;
    }

    _createClass(Visualizer, [{
      key: 'startVisualizer',
      value: function startVisualizer(hideToast) {
        if (!hideToast) {
          this.toast.nowPlaying({
            title: this.currentlyPlaying.item.name,
            album: this.currentlyPlaying.item.album.name,
            artist: this.currentlyPlaying.item.artists[0].name,
            artwork: this.currentlyPlaying.item.album.images[0].url
          });
        }

        if (this.initialized === false) {
          this.events.beforeInit.call();
          this.initialized = true;
          this.events.afterInit.call();
        }

        this.setIntervalHooks();
        this.events.beforeStart.call();
        this.events.afterStart.call();
        this.initializeHooks();
        this.active = true;
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
        var _this2 = this;

        this.updateTrackProgress();

        var songsInSync = JSON.stringify(this.currentlyPlaying.item) === JSON.stringify(response.item);
        var syncError = Math.abs(this.trackProgress.progress - (response.progress_ms + response.delay));

        console.log('Sync error: ' + (parseInt(syncError) || '0') + 'ms');

        var getData = function getData(noToast) {
          _this2.toast.syncing();
          var timestamp = window.performance.now();
          _this2.currentlyPlaying = response;
          Promise.all([_this2.getTrackFeatures(), _this2.getTrackAnalysis()]).then(function (responses) {
            _this2.loadingNext = false;
            _this2.stopVisualizer();
            _this2.trackFeatures = responses[0];
            _this2.trackAnalysis = responses[1];
            _this2.updateTrackProgress(response.delay + (window.performance.now() - timestamp));
            _this2.startVisualizer(noToast);
            _this2.pingSpotify();
          });
        };

        if (this.active && response.is_playing && songsInSync && syncError > 1500) {
          return getData(true);
        }

        if ((typeof response === 'undefined' ? 'undefined' : _typeof(response)) !== 'object' || !response.is_playing) {
          if (!this.loadingNext) {
            this.toast.notPlaying();
          }

          if (this.active) {
            this.stopVisualizer();
          }

          return this.pingSpotify();
        }

        if (!this.active) {
          if (songsInSync && this.loadingNext) {
            return this.pingSpotify();
          }

          return getData();
        } else {
          if (songsInSync) {
            return this.pingSpotify();
          }

          getData();
        }
      }
    }, {
      key: 'pingSpotify',
      value: function pingSpotify(skipDelay) {
        var _this3 = this;

        setTimeout(function () {
          _this3.getCurrentlyPlaying().then(function (response) {
            return _this3.processResponse(response);
          }).catch(function (err) {
            return _this3.processResponse(err);
          });
        }, skipDelay ? 0 : 1000);
      }
    }]);

    return Visualizer;
  }(_spotifyConnect2.default);

  exports.default = Visualizer;
});
//# sourceMappingURL=visualizer.js.map
