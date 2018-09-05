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

      this.loginButton();
      window.ZACH = new _kaleidoscope2.default(true);
      document.body.classList.add('loaded');
    }

    _createClass(Index, [{
      key: 'loginButton',
      value: function loginButton() {
        var button = document.querySelector('.login');
        button.addEventListener('click', this.getAuthId);
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
    }]);

    return Index;
  }();

  exports.default = Index;
});
//# sourceMappingURL=index.js.map
