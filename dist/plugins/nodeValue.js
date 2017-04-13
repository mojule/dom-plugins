'use strict';

var is = require('@mojule/is');

var nodeValue = function nodeValue(node) {
  return {
    getNodeValue: function getNodeValue() {
      return node.getValue('nodeValue');
    },
    setNodeValue: function setNodeValue(value) {
      if (is.undefined(value)) throw new Error('nodeValue cannot be undefined');

      return node.setValue('nodeValue', value);
    },
    nodeValue: function nodeValue(value) {
      if (!is.undefined(value)) return node.setNodeValue(value);

      return node.getNodeValue();
    }
  };
};

module.exports = nodeValue;