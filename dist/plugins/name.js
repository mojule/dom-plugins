'use strict';

var is = require('@mojule/is');

var name = function name(node) {
  return {
    tagName: function tagName() {
      var tagName = node.getValue('tagName');

      if (is.string(tagName)) {
        if (tagName.length === 0) throw new Error('Expected tagName to be a non-empty string');

        return tagName;
      }

      return node.nodeType();
    },
    nodeName: function nodeName() {
      if (node.isText()) return '#text';

      if (node.isComment()) return '#comment';

      if (node.isDocument()) return '#document';

      if (node.isDocumentFragment()) return '#document-fragment';

      if (node.isDocumentType()) {
        var _name = node.getValue('name');

        if (is.string(_name)) {
          if (_name.length === 0) throw new Error('Expected document type name to be a non-empty string');

          return _name;
        }

        return node.treeType();
      }

      return node.tagName();
    }
  };
};

module.exports = name;