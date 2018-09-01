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

  var Canvas = function () {
    function Canvas(canvas) {
      _classCallCheck(this, Canvas);

      this.isMobile = window.matchMedia('(max-width: 480px)').matches;
      this.width = this.isMobile ? window.innerWidth * 2 : window.innerWidth;
      this.height = this.isMobile ? window.innerHeight * 2 : window.innerHeight;
      this.node = document.getElementById(canvas);
      this.node.removeAttribute('style');
      this.node.width = this.width;
      this.node.height = this.height;
      this.ctx = this.node.getContext('2d');
      this.stars = [];
      this.background = {};
      this.raf;
      this.initialized = false;
      this.isPainting = false;

      if (this.isMobile) {
        this.node.style.transform = 'scale(.5) translateY(-50%) translateX(-50%)';
      }
    }

    _createClass(Canvas, [{
      key: 'addStar',
      value: function addStar(el) {
        this.stars.push(el);
      }
    }, {
      key: 'addBackground',
      value: function addBackground(el) {
        this.background = el;
      }
    }, {
      key: 'paint',
      value: function paint() {
        var _this = this;

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.background.draw(this.ctx);
        this.stars.forEach(function (el) {
          return el.draw(_this.ctx);
        });
        this.raf = requestAnimationFrame(this.paint.bind(this));
      }
    }, {
      key: 'startPaint',
      value: function startPaint() {
        this.paint();
        this.isPainting = true;
      }
    }, {
      key: 'stopPaint',
      value: function stopPaint() {
        cancelAnimationFrame(this.raf);
        this.isPainting = false;
      }
    }, {
      key: 'init',
      value: function init() {
        if (this.initialized === false) {
          this.startPaint();
          this.isPainting = true;
          this.initialized = true;
        }
      }
    }]);

    return Canvas;
  }();

  exports.default = Canvas;
});
//# sourceMappingURL=canvas.js.map
