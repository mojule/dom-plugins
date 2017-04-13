'use strict';

var CSSselect = require('css-select');
var adapter = require('../css-select-adapter');

var options = { adapter: adapter };

var selectPlugin = function selectPlugin(node) {
  return {
    querySelector: function querySelector(selector) {
      return CSSselect.selectOne(selector, node, options);
    },
    querySelectorAll: function querySelectorAll(selector) {
      return CSSselect(selector, node, options);
    },
    matches: function matches(selector) {
      return CSSselect.is(node, selector, options);
    }
  };
};

module.exports = selectPlugin;