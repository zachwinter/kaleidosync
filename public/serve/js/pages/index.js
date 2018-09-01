define(['exports', '../kaleidosync/kaleidoscope'], function (exports, _kaleidoscope) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _kaleidoscope2 = _interopRequireDefault(_kaleidoscope);

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

  var Index = function () {
    function Index() {
      _classCallCheck(this, Index);

      window.KALEIDOSYNC = new _kaleidoscope2.default(true, true);

      this.demoActive = false;

      this.shade = document.getElementById('shade');
      this.buttons = document.querySelector('.buttons');
      this.login = this.buttons.querySelector('.login');
      this.demo = this.buttons.querySelector('.demo');

      document.body.classList.add('loaded');

      this.shade.addEventListener('transitionend', this.onLoaded.bind(this));
      this.login.addEventListener('click', this.getAuthId);
      this.demo.addEventListener('click', this.toggleDemo);
    }

    _createClass(Index, [{
      key: 'onLoaded',
      value: function onLoaded() {
        this.buttons.classList.add('show');
        this.shade.classList.add('hide');
        this.shade.removeEventListener('transitionend', this.onLoaded);
      }
    }, {
      key: 'getAuthId',
      value: function getAuthId() {
        fetch('/auth').then(function (res) {
          return res.json();
        }).then(function (res) {
          if (res.auth_id) {
            window.location.href = '/login?auth_id=' + res.auth_id;
          }
        });
      }
    }, {
      key: 'toggleDemo',
      value: function toggleDemo() {
        if (!this.demoActive) {
          window.KALEIDOSYNC.interval = false;
          window.KALEIDOSYNC.setEventHooks();
          window.KALEIDOSYNC.initializeVisualizer();
          window.KALEIDOSYNC.canvas.startPaint();
          this.demoActive = true;
        } else {
          window.KALEIDOSYNC.interval = true;
          window.KALEIDOSYNC.audio.pause();
          window.KALEIDOSYNC.stopVisualizer();
          window.KALEIDOSYNC.canvas.stopPaint();
          this.demoActive = false;
        }
      }
    }]);

    return Index;
  }();

  exports.default = Index;
});
//# sourceMappingURL=index.js.map
