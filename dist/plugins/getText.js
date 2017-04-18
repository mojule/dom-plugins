'use strict';

var is = require('@mojule/is');

var getText = function getText(node) {
  return {
    getText: function getText() {
      if (node.isText()) return node.nodeValue();

      var children = node.getChildren();

      if (children.length > 0) return children.reduce(function (text, child) {
        return text + child.getText();
      }, '');

      return '';
    }
  };
};

module.exports = getText;