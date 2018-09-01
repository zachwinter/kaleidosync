define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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
      _classCallCheck(this, Toast);

      this.duration = 5000;
      this.el = document.createElement('div');
      this.el.id = 'toast';
      document.body.appendChild(this.el);
    }

    _createClass(Toast, [{
      key: 'notPlaying',
      value: function notPlaying() {
        this.el.innerHTML = '\n      <h1><i>No song currently playing.</i></h1>\n    ';

        this.show();
      }
    }, {
      key: 'nowPlaying',
      value: function nowPlaying(track) {
        var _this = this;

        this.el.innerHTML = '\n      <img src="' + track.artwork + '" />\n      <h1>' + track.title + ' <span>' + track.artist + '</span></h1>\n    ';

        this.show();

        setTimeout(function () {
          _this.hide();
        }, this.duration);
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
