'use strict';

var is = require('@mojule/is');

var creators = ['createElement', 'createText', 'createComment', 'createDocument', 'createDocumentType', 'createDocumentFragment'];

var Adapter = function Adapter(Tree) {
  var adapter = {
    isNode: function isNode(node) {
      return is.function(node.get);
    },
    appendChild: function appendChild(node, child) {
      return node.append(child);
    },
    addAttributes: function addAttributes(node, attributes) {
      return node.setAttributes(attributes);
    }
  };

  creators.forEach(function (key) {
    return adapter[key] = Tree[key];
  });

  return adapter;
};

module.exports = Adapter;