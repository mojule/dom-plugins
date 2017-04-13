'use strict';

var createOmNode = function createOmNode(node) {
  return {
    $createText: function $createText(text) {
      var value = {
        nodeType: 'text',
        nodeValue: text
      };

      return node(value);
    },
    $createComment: function $createComment(comment) {
      var value = {
        nodeType: 'comment',
        nodeValue: comment
      };

      return node(value);
    },
    $createDocumentFragment: function $createDocumentFragment() {
      var value = { nodeType: 'documentFragment' };

      return node(value);
    },
    $createDocumentType: function $createDocumentType(name) {
      var publicId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var systemId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      var nodeType = 'documentType';
      var value = { nodeType: nodeType, name: name, publicId: publicId, systemId: systemId };

      return node(value);
    },
    $createDocument: function $createDocument() {
      var value = { nodeType: 'document' };

      return node(value);
    },
    $createElement: function $createElement(tagName) {
      var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var nodeType = 'element';
      var value = { nodeType: nodeType, tagName: tagName, attributes: attributes };

      return node(value);
    }
  };
};

module.exports = createOmNode;