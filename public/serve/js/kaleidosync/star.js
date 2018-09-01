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

  var PI = exports.PI = Math.PI;
  var ROTATION = exports.ROTATION = PI / 2 * 3;

  var Star = function () {
    function Star(props) {
      _classCallCheck(this, Star);

      for (var prop in props) {
        this[prop] = props[prop];
      }

      this.step = PI / this.points;
    }

    _createClass(Star, [{
      key: "update",
      value: function update(props) {
        for (var prop in props) {
          this[prop] = props[prop];
        }
      }
    }, {
      key: "draw",
      value: function draw(ctx) {
        var rotation = ROTATION;
        var x = this.x;
        var y = this.y;

        ctx.beginPath(this.points);
        ctx.moveTo(this.x, this.y - this.outerRadius);

        for (var i = 0; i < this.points; i++) {
          x = this.x + Math.cos(rotation) * this.outerRadius;
          y = this.y + Math.sin(rotation) * this.outerRadius;
          ctx.lineTo(x, y);
          rotation += this.step;
          x = this.x + Math.cos(rotation) * this.innerRadius;
          y = this.y + Math.sin(rotation) * this.innerRadius;
          ctx.lineTo(x, y);
          rotation += this.step;
        }

        ctx.lineTo(this.x, this.y - this.outerRadius);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }]);

    return Star;
  }();

  exports.default = Star;
});
//# sourceMappingURL=star.js.map
