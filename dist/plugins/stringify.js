'use strict';

var utils = require('@mojule/utils');

var escapeHtml = utils.escapeHtml;


var stringify = function stringify(node) {
  var stringify = function stringify() {
    var ml = '';

    var nodeType = node.nodeType();

    if (node.isText()) ml += escapeHtml(node.nodeValue());

    if (node.isComment()) ml += '<!--' + node.nodeValue() + '-->';

    if (node.isElement()) {
      ml += '<' + node.tagName();

      var attributes = node.getAttributes();

      Object.keys(attributes).forEach(function (name) {
        var value = attributes[name];

        ml += ' ' + name;

        if (value) ml += '="' + value + '"';
      });

      ml += node.isEmpty() ? ' />' : '>';
    }

    if (node.isDocumentType()) {
      var _node$getValue = node.getValue(),
          name = _node$getValue.name,
          publicId = _node$getValue.publicId,
          systemId = _node$getValue.systemId;

      ml += '<!doctype ' + name;

      if (publicId) {
        ml += ' public "' + publicId + '"';
      }

      if (systemId) {
        ml += ' "' + systemId + '"';
      }

      ml += '>';
    }

    node.getChildren().forEach(function (child) {
      return ml += child.stringify();
    });

    if (node.isElement() && !node.isEmpty()) {
      ml += '</' + node.tagName() + '>';
    }

    return ml;
  };

  return { stringify: stringify };
};

module.exports = stringify;