'use strict';

var is = require('@mojule/is');

var treeType = function treeType(node) {
  return {
    $treeType: function $treeType() {
      return 'tree';
    }
  };
};

module.exports = treeType;