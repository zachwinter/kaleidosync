define(['exports', './pages/index', './kaleidosync/kaleidoscope'], function (exports, _index, _kaleidoscope) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _index2 = _interopRequireDefault(_index);

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

  var App = function App() {
    _classCallCheck(this, App);

    var bodyClass = document.body.classList;

    if (bodyClass.contains('index')) {
      this.index = new _index2.default();
    }

    if (bodyClass.contains('visualizer')) {
      window.KALEIDOSYNC = new _kaleidoscope2.default(false);
      window.KALEIDOSYNC.duration = 100;
      window.KALEIDOSYNC.buildSingleState(true);
      document.body.classList.add('loaded');
    }
  };

  exports.default = new App();
});
//# sourceMappingURL=app.js.map
