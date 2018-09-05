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

  var HTMLParser = function () {
    function HTMLParser() {
      _classCallCheck(this, HTMLParser);
    }

    _createClass(HTMLParser, [{
      key: 'typeHtmlChars',
      value: function typeHtmlChars(curString, curStrPos, self) {
        if (self.contentType !== 'html') return curStrPos;
        var curChar = curString.substr(curStrPos).charAt(0);
        if (curChar === '<' || curChar === '&') {
          var endTag = '';
          if (curChar === '<') {
            endTag = '>';
          } else {
            endTag = ';';
          }
          while (curString.substr(curStrPos + 1).charAt(0) !== endTag) {
            curStrPos++;
            if (curStrPos + 1 > curString.length) {
              break;
            }
          }
          curStrPos++;
        }
        return curStrPos;
      }
    }, {
      key: 'backSpaceHtmlChars',
      value: function backSpaceHtmlChars(curString, curStrPos, self) {
        if (self.contentType !== 'html') return curStrPos;
        var curChar = curString.substr(curStrPos).charAt(0);
        if (curChar === '>' || curChar === ';') {
          var endTag = '';
          if (curChar === '>') {
            endTag = '<';
          } else {
            endTag = '&';
          }
          while (curString.substr(curStrPos - 1).charAt(0) !== endTag) {
            curStrPos--;
            if (curStrPos < 0) {
              break;
            }
          }
          curStrPos--;
        }
        return curStrPos;
      }
    }]);

    return HTMLParser;
  }();

  exports.default = HTMLParser;
  var htmlParser = exports.htmlParser = new HTMLParser();
});
//# sourceMappingURL=html-parser.js.map
