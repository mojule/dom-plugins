'use strict';

var preserveWhitespace = require('./preserve-whitespace');

var defaultOptions = {
  removeWhitespace: false,
  ignoreWhitespace: false,
  normalizeWhitespace: false,
  preserveWhitespace: preserveWhitespace
};

var whitespaceTest = /\s+/g;

var whitespace = function whitespace(node) {
  return {
    collapseText: function collapseText() {
      node.walk(function (current) {
        if (!current.isText()) return;

        var previous = current.previousSibling();

        if (!previous) return;
        if (!previous.isText()) return;

        var thisText = current.nodeValue();
        var previousText = previous.nodeValue();

        previous.nodeValue(previousText + thisText);
        current.remove();
      });
    },
    whitespace: function whitespace(options) {
      node.collapseText();

      options = Object.assign({}, defaultOptions, options);

      var _options = options,
          preserveWhitespace = _options.preserveWhitespace,
          removeWhitespace = _options.removeWhitespace,
          normalizeWhitespace = _options.normalizeWhitespace,
          ignoreWhitespace = _options.ignoreWhitespace;


      var isHandleWhitespace = removeWhitespace || normalizeWhitespace || ignoreWhitespace;

      if (isHandleWhitespace) {
        var next = function next(current) {
          var tagName = current.tagName();
          if (preserveWhitespace.includes(tagName)) return;

          if (current.isText()) {
            if (removeWhitespace && current.nodeValue().trim() === '') {
              current.remove();

              return;
            }

            if (normalizeWhitespace || ignoreWhitespace) {
              var text = current.nodeValue().replace(whitespaceTest, ' ');

              current.nodeValue(text);
            }
          } else {
            current.getChildren().forEach(next);
          }
        };

        next(node);
      }
    }
  };
};

module.exports = whitespace;