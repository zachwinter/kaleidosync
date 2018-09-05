define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

  var Toast = function () {
    function Toast() {
      var _this = this;

      _classCallCheck(this, Toast);

      this.duration = 6000;
      this.el = document.createElement('div');
      this.el.id = 'toast';
      document.body.appendChild(this.el);
      this.visible = false;

      this.typedOptions = {
        showCursor: false,
        typeSpeed: 40,
        onComplete: function onComplete() {
          return setTimeout(function () {
            _this.hide();
            _this.visible = false;
          }, _this.duration);
        }
      };
    }

    _createClass(Toast, [{
      key: 'notPlaying',
      value: function notPlaying() {
        if (this.visible === false) {
          this.el.innerHTML = '\n        <h1><i id="typed"></i></h1>\n      ';

          this.show();

          this.typed = new Typed('#typed', _extends({}, this.typedOptions, {
            strings: ['No song detected! Play a song in Spotify to get started.'],
            onComplete: function onComplete() {}
          }));

          this.visible = true;
        }
      }
    }, {
      key: 'syncing',
      value: function syncing() {
        this.el.innerHTML = '\n      <h1><i id="typed"></i></h1>\n    ';

        this.show();

        this.typed = new Typed('#typed', _extends({}, this.typedOptions, {
          strings: ['Syncing . . .'],
          typeSpeed: 200
        }));
      }
    }, {
      key: 'nowPlaying',
      value: function nowPlaying(track) {
        this.el.innerHTML = '\n      <img src="' + track.artwork + '" />\n      <h1><i id="typed"></i> <span>' + track.artist + '</span></h1>\n    ';

        this.show();

        this.typed = new Typed('#typed', _extends({}, this.typedOptions, {
          strings: [track.title]
        }));
      }
    }, {
      key: 'show',
      value: function show() {
        var _this2 = this;

        setTimeout(function () {
          _this2.el.style.opacity = 1;
        }, 20);
      }
    }, {
      key: 'hide',
      value: function hide() {
        var _this3 = this;

        setTimeout(function () {
          _this3.el.style.opacity = 0;
        }, 20);
      }
    }]);

    return Toast;
  }();

  exports.default = Toast;
});
//# sourceMappingURL=toast.js.map
