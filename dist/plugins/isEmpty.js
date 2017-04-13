'use strict';

var isEmpty = function isEmpty(node) {
  var _isEmpty = node.isEmpty;


  return {
    isEmpty: function isEmpty() {
      if (node.isText() || node.isComment() || node.isDocumentType()) return true;

      if (node.isDocumentFragment() || node.isDocument()) return false;

      return _isEmpty();
    }
  };
};

module.exports = isEmpty;