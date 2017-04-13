'use strict';

var is = require('@mojule/is');
var H = require('html-script');
var Adapter = require('../html-script-adapter');

var nonTags = ['#text', '#comment', '#document', '#document-type', '#document-fragment'];

var HFactory = function HFactory(api) {
  return {
    $H: function $H() {
      for (var _len = arguments.length, nodeNames = Array(_len), _key = 0; _key < _len; _key++) {
        nodeNames[_key] = arguments[_key];
      }

      if (nodeNames.length === 1 && is.array(nodeNames[0])) nodeNames = nodeNames[0];

      var options = {};

      if (nodeNames.length > 0) options.nodeNames = nodeNames.concat(nonTags);

      var adapter = Adapter(api);
      var h = H(adapter, options);

      return h;
    }
  };
};

module.exports = HFactory;