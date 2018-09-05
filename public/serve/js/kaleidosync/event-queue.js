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

  var EventQueue = function () {
    function EventQueue() {
      _classCallCheck(this, EventQueue);

      this.queue = [];
    }

    _createClass(EventQueue, [{
      key: "add",
      value: function add(method) {
        this.queue.add(method);
      }
    }, {
      key: "call",
      value: function call() {
        this.queue.forEach(function (method) {
          method.call();
        });
      }
    }]);

    return EventQueue;
  }();

  exports.default = EventQueue;
});
//# sourceMappingURL=event-queue.js.map
