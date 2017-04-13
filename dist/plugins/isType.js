'use strict';

var isType = function isType(node) {
  return {
    isText: function isText() {
      return node.nodeType() === 'text';
    },
    isComment: function isComment() {
      return node.nodeType() === 'comment';
    },
    isDocumentFragment: function isDocumentFragment() {
      return node.nodeType() === 'documentFragment';
    },
    isDocumentType: function isDocumentType() {
      return node.nodeType() === 'documentType';
    },
    isDocument: function isDocument() {
      return node.nodeType() === 'document';
    },
    isElement: function isElement() {
      if (node.nodeType() === 'element') return true;

      return !node.isText() && !node.isComment() && !node.isDocumentFragment() && !node.isDocumentType() && !node.isDocument();
    }
  };
};

module.exports = isType;