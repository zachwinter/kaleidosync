define(['exports', '../lib/js.cookie'], function (exports, _js) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _js2 = _interopRequireDefault(_js);

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

  var SpotifyConnect = function () {
    function SpotifyConnect() {
      var _this = this;

      _classCallCheck(this, SpotifyConnect);

      this.accessToken = _js2.default.get('KALEIDOSYNC_ACCESS_TOKEN');
      this.refreshToken = _js2.default.get('KALEIDOSYNC_REFRESH_TOKEN');
      this.refreshCode = _js2.default.get('KALEIDOSYNC_REFRESH_CODE');
      this.headers = {
        Authorization: 'Bearer ' + this.accessToken,
        Accept: 'application/json'
      };

      this.currentlyPlaying = {};
      this.trackAnalysis = {};
      this.trackProgress = {};
      this.trackFeatures = {};

      this.intervals = {
        types: ['tatums', 'segments', 'beats', 'bars', 'sections'],
        active: {},
        next: {},
        last: {},
        initial: {},
        hooks: {}
      };

      this.intervals.types.forEach(function (type) {
        _this.intervals.active[type] = {};
        _this.intervals.next[type] = {};
        _this.intervals.last[type] = {};
        _this.intervals.initial[type] = {};
        _this.intervals.hooks[type] = function () {};
      });

      this.onTrackComplete = function () {};
    }

    _createClass(SpotifyConnect, [{
      key: 'GetJSON',
      value: function GetJSON(url) {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          var request = new XMLHttpRequest();
          request.open('GET', url, true);
          for (var header in _this2.headers) {
            if (_this2.headers.hasOwnProperty(header)) {
              request.setRequestHeader(header, _this2.headers[header]);
            }
          }
          request.onload = function () {
            if (request.status !== 200) {
              reject('ERROR');
            } else {
              resolve(JSON.parse(request.responseText));
            }
          };
          request.onerror = function () {
            return reject('ERROR');
          };
          request.send();
        });
      }
    }, {
      key: 'getCurrentlyPlaying',
      value: function getCurrentlyPlaying() {
        var _this3 = this;

        var delay = window.performance.now();

        return new Promise(function (resolve, reject) {
          _this3.GetJSON('https://api.spotify.com/v1/me/player/currently-playing').then(function (res) {
            return resolve(_extends({}, res, { delay: window.performance.now() - delay }));
          }).catch(function (err) {
            return reject(err);
          });
        });
      }
    }, {
      key: 'getTrackFeatures',
      value: function getTrackFeatures() {
        return this.GetJSON('https://api.spotify.com/v1/audio-features/' + this.currentlyPlaying.item.id);
      }
    }, {
      key: 'getTrackAnalysis',
      value: function getTrackAnalysis() {
        return this.GetJSON('https://api.spotify.com/v1/audio-analysis/' + this.currentlyPlaying.item.id);
      }
    }, {
      key: 'updateTrackProgress',
      value: function updateTrackProgress(delay, reset) {
        if (reset) {
          this.trackProgress = {
            progress: 0,
            timestamp: 0
          };
          return;
        }

        if (delay) {
          this.trackProgress = {
            progress: this.currentlyPlaying.progress_ms + delay,
            timestamp: window.performance.now()
          };
        } else {
          this.trackProgress = {
            progress: this.trackProgress.progress + (window.performance.now() - this.trackProgress.timestamp),
            timestamp: window.performance.now()
          };
        }
      }
    }, {
      key: 'determineInitialIntervals',
      value: function determineInitialIntervals(type) {
        for (var i = 0; i < this.trackAnalysis[type].length; i++) {
          this.updateTrackProgress();

          /** If last interval... */
          if (i === this.trackAnalysis[type].length - 1) {
            this.intervals.active[type] = this.trackAnalysis[type][i];
            this.intervals.initial[type] = this.trackAnalysis[type][i];
            this.intervals.active[type].index = i;
            this.intervals.initial[type].index = i;

            return;
          }

          /** If current track progress falls within current interval. */
          if (this.trackAnalysis[type][i].start < this.trackProgress.progress / 1000 && this.trackProgress.progress / 1000 < this.trackAnalysis[type][i + 1].start) {
            this.intervals.active[type] = this.trackAnalysis[type][i];
            this.intervals.initial[type] = this.trackAnalysis[type][i];
            this.intervals.next[type] = this.trackAnalysis[type][i + 1];
            this.intervals.active[type].index = i;
            this.intervals.initial[type].index = i;
            this.intervals.next[type].index = i + 1;
            break;
          }
        }
      }
    }, {
      key: 'executeIntervalHooks',
      value: function executeIntervalHooks(type, interval, index, initialize) {
        var _this4 = this;

        this.intervals.active[type] = interval;
        this.intervals.next[type] = this.trackAnalysis[type][index + 1] || null;
        this.intervals.last[type] = this.trackAnalysis[type][index - 1] || null;
        this.intervals.active[type].index = index;

        if (typeof this.intervals.hooks[type] === 'function') {
          this.updateTrackProgress();
          this.intervals.hooks[type].call();
          this.updateTrackProgress();
        }

        if (!this.intervals.next[type]) {
          if (type === 'tatums') {
            this.onTrackComplete.bind(this).call();
          }
          return;
        }

        var recursionDelay = 0;

        if (initialize === true) {
          recursionDelay = this.intervals.next[type].start * 1000 - this.trackProgress.progress;
        } else {
          recursionDelay = interval.duration * 1000 - (this.trackProgress.progress - interval.start * 1000);
        }

        if (this.intervals.next[type] !== null) {
          this.intervals.active[type].timeout = setTimeout(function () {
            _this4.executeIntervalHooks(type, _this4.intervals.next[type], index + 1, false);
          }, recursionDelay);
        }
      }
    }, {
      key: 'removeHooks',
      value: function removeHooks() {
        var _this5 = this;

        this.intervals.types.forEach(function (type) {
          clearTimeout(_this5.intervals.active[type].timeout);
          delete _this5.intervals.hooks[type];
        });
      }
    }, {
      key: 'initializeHooks',
      value: function initializeHooks() {
        var _this6 = this;

        this.intervals.types.forEach(function (type) {
          _this6.trackAnalysis[type][0] = _extends({}, _this6.trackAnalysis[type][0], {
            start: 0,
            duration: _this6.trackAnalysis[type][0].start + _this6.trackAnalysis[type][0].duration
          });

          _this6.determineInitialIntervals(type);
          _this6.executeIntervalHooks(type, _this6.intervals.active[type], _this6.intervals.active[type].index, true);
        });
      }
    }]);

    return SpotifyConnect;
  }();

  exports.default = SpotifyConnect;
});
//# sourceMappingURL=spotify-connect.js.map
