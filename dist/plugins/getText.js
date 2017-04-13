'use strict';

var is = require('@mojule/is');

var text = function text(node) {
  if (is.array(node)) return node.map(text).join('');

  if (node.isText()) return node.nodeValue();

  var children = node.getChildren();

  if (children.length > 0) return text(children);

  return '';
};

var getText = function getText(node) {
  return {
    getText: function getText() {
      return text(node);
    }
  };
};

module.exports = getText;