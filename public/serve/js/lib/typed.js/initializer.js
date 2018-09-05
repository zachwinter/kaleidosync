define(['exports', './defaults.js'], function (exports, _defaults) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initializer = undefined;

  var _defaults2 = _interopRequireDefault(_defaults);

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

  var Initializer = function () {
    function Initializer() {
      _classCallCheck(this, Initializer);
    }

    _createClass(Initializer, [{
      key: 'load',
      value: function load(self, options, elementId) {
        // chosen element to manipulate text
        if (typeof elementId === 'string') {
          self.el = document.querySelector(elementId);
        } else {
          self.el = elementId;
        }

        self.options = _extends({}, _defaults2.default, options);

        // attribute to type into
        self.isInput = self.el.tagName.toLowerCase() === 'input';
        self.attr = self.options.attr;
        self.bindInputFocusEvents = self.options.bindInputFocusEvents;

        // show cursor
        self.showCursor = self.isInput ? false : self.options.showCursor;

        // custom cursor
        self.cursorChar = self.options.cursorChar;

        // Is the cursor blinking
        self.cursorBlinking = true;

        // text content of element
        self.elContent = self.attr ? self.el.getAttribute(self.attr) : self.el.textContent;

        // html or plain text
        self.contentType = self.options.contentType;

        // typing speed
        self.typeSpeed = self.options.typeSpeed;

        // add a delay before typing starts
        self.startDelay = self.options.startDelay;

        // backspacing speed
        self.backSpeed = self.options.backSpeed;

        // only backspace what doesn't match the previous string
        self.smartBackspace = self.options.smartBackspace;

        // amount of time to wait before backspacing
        self.backDelay = self.options.backDelay;

        // Fade out instead of backspace
        self.fadeOut = self.options.fadeOut;
        self.fadeOutClass = self.options.fadeOutClass;
        self.fadeOutDelay = self.options.fadeOutDelay;

        // variable to check whether typing is currently paused
        self.isPaused = false;

        // input strings of text
        self.strings = self.options.strings.map(function (s) {
          return s.trim();
        });

        // div containing strings
        if (typeof self.options.stringsElement === 'string') {
          self.stringsElement = document.querySelector(self.options.stringsElement);
        } else {
          self.stringsElement = self.options.stringsElement;
        }

        if (self.stringsElement) {
          self.strings = [];
          self.stringsElement.style.display = 'none';
          var strings = Array.prototype.slice.apply(self.stringsElement.children);
          var stringsLength = strings.length;

          if (stringsLength) {
            for (var i = 0; i < stringsLength; i += 1) {
              var stringEl = strings[i];
              self.strings.push(stringEl.innerHTML.trim());
            }
          }
        }

        // character number position of current string
        self.strPos = 0;

        // current array position
        self.arrayPos = 0;

        // index of string to stop backspacing on
        self.stopNum = 0;

        // Looping logic
        self.loop = self.options.loop;
        self.loopCount = self.options.loopCount;
        self.curLoop = 0;

        // shuffle the strings
        self.shuffle = self.options.shuffle;
        // the order of strings
        self.sequence = [];

        self.pause = {
          status: false,
          typewrite: true,
          curString: '',
          curStrPos: 0

          // When the typing is complete (when not looped)
        };self.typingComplete = false;

        // Set the order in which the strings are typed
        for (var _i in self.strings) {
          self.sequence[_i] = _i;
        }

        // If there is some text in the element
        self.currentElContent = this.getCurrentElContent(self);

        self.autoInsertCss = self.options.autoInsertCss;

        this.appendAnimationCss(self);
      }
    }, {
      key: 'getCurrentElContent',
      value: function getCurrentElContent(self) {
        var elContent = '';
        if (self.attr) {
          elContent = self.el.getAttribute(self.attr);
        } else if (self.isInput) {
          elContent = self.el.value;
        } else if (self.contentType === 'html') {
          elContent = self.el.innerHTML;
        } else {
          elContent = self.el.textContent;
        }
        return elContent;
      }
    }, {
      key: 'appendAnimationCss',
      value: function appendAnimationCss(self) {
        var cssDataName = 'data-typed-js-css';
        if (!self.autoInsertCss) {
          return;
        }
        if (!self.showCursor && !self.fadeOut) {
          return;
        }
        if (document.querySelector('[' + cssDataName + ']')) {
          return;
        }

        var css = document.createElement('style');
        css.type = 'text/css';
        css.setAttribute(cssDataName, true);

        var innerCss = '';
        if (self.showCursor) {
          innerCss += '\n        .typed-cursor{\n          opacity: 1;\n        }\n        .typed-cursor.typed-cursor--blink{\n          animation: typedjsBlink 0.7s infinite;\n          -webkit-animation: typedjsBlink 0.7s infinite;\n                  animation: typedjsBlink 0.7s infinite;\n        }\n        @keyframes typedjsBlink{\n          50% { opacity: 0.0; }\n        }\n        @-webkit-keyframes typedjsBlink{\n          0% { opacity: 1; }\n          50% { opacity: 0.0; }\n          100% { opacity: 1; }\n        }\n      ';
        }
        if (self.fadeOut) {
          innerCss += '\n        .typed-fade-out{\n          opacity: 0;\n          transition: opacity .25s;\n        }\n        .typed-cursor.typed-cursor--blink.typed-fade-out{\n          -webkit-animation: 0;\n          animation: 0;\n        }\n      ';
        }
        if (css.length === 0) {
          return;
        }
        css.innerHTML = innerCss;
        document.body.appendChild(css);
      }
    }]);

    return Initializer;
  }();

  exports.default = Initializer;
  var initializer = exports.initializer = new Initializer();
});
//# sourceMappingURL=initializer.js.map
