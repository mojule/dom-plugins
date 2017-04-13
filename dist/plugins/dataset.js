'use strict';

var is = require('@mojule/is');
var utils = require('@mojule/utils');

var camelCaseToHyphenated = utils.camelCaseToHyphenated,
    hyphenatedToCamelCase = utils.hyphenatedToCamelCase;


var dataset = function dataset(node) {
  return {
    getDataset: function getDataset() {
      var attributes = node.getAttributes();

      if (is.empty(attributes)) return attributes;

      var attributeKeys = Object.keys(attributes);
      var dataKeys = attributeKeys.filter(function (key) {
        return key.startsWith('data-');
      });

      var dataset = dataKeys.reduce(function (set, dataKey) {
        var prefixRemoved = dataKey.slice('data-'.length);
        var camelCased = hyphenatedToCamelCase(prefixRemoved);

        set[camelCased] = attributes[dataKey].toString();

        return set;
      }, {});

      return dataset;
    },
    // lossy - see comment in attributes
    setDataset: function setDataset(dataset) {
      if (!is.object(dataset)) throw new Error('Expected dataset to be an object');

      Object.keys(dataset).forEach(function (key) {
        var dataKey = 'data-' + camelCaseToHyphenated(key);
        var value = dataset[key].toString();

        node.setAttr(dataKey, value);
      });

      return dataset;
    },
    dataset: function dataset(_dataset) {
      if (!is.undefined(_dataset)) return node.setDataset(_dataset);

      return node.getDataset(_dataset);
    }
  };
};

module.exports = dataset;