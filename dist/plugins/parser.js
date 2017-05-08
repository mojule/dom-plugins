'use strict';

var htmlparser2 = require('htmlparser2');
var DomHandler = require('../domhandler-adapter');
var preserveWhitespace = require('./preserve-whitespace');

var defaultOptions = {
  /*
    otherwise self closing tags don't work - htmlparser2 whitelists them in
    normal mode
  */
  xmlMode: true,
  removeWhitespace: false,
  normalizeWhitespace: false,
  ignoreWhitespace: false,
  preserveWhitespace: preserveWhitespace
};

var parser = function parser(node) {
  return {
    $parse: function $parse(str) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      options = Object.assign({}, defaultOptions, options);

      var handler = DomHandler(node, options);

      // look at the API on this thing 😂
      new htmlparser2.Parser(handler, options).end(str);

      var dom = handler.getDom();

      dom.whitespace(options);

      var isSingleElement = dom.isDocumentFragment() && dom.getChildren().length === 1;

      if (isSingleElement) return dom.firstChild().clone();

      return dom;
    }
  };
};

module.exports = parser;