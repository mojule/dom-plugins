'use strict';

var is = require('@mojule/is');

var name = function name(node) {
  return {
    tagName: function tagName(value) {
      if (is.string(value)) {
        return node.setTagName(value);
      }

      return node.getTagName();
    },
    getTagName: function getTagName() {
      var tagName = node.getValue('tagName');

      if (is.string(tagName)) {
        if (tagName.trim() === '') throw new Error('Expected tagName to be a non-empty string');

        return tagName;
      }

      return node.nodeType();
    },
    setTagName: function setTagName(value) {
      if (!is.string(value) || value.trim() === '') throw new Error('Expected tagName to be a non-empty string');

      value = value.trim();

      node.setValue('tagName', value);

      return value;
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