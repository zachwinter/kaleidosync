define(["exports"], function (exports) {
  "use strict";

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

  var Rectangle = function () {
    function Rectangle(props) {
      _classCallCheck(this, Rectangle);

      for (var prop in props) {
        this[prop] = props[prop];
      }
    }

    _createClass(Rectangle, [{
      key: "update",
      value: function update(props) {
        for (var prop in props) {
          this[prop] = props[prop];
        }
      }
    }, {
      key: "draw",
      value: function draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
      }
    }]);

    return Rectangle;
  }();

  exports.default = Rectangle;
});
//# sourceMappingURL=rectangle.js.map
