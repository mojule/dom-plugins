'use strict';

var is = require('@mojule/is');
var utils = require('@mojule/utils');
var preserveWhitespace = require('./preserve-whitespace');

var escapeHtml = utils.escapeHtml;


var defaultOptions = {
  indent: '  ',
  pretty: false,
  depth: 0,
  wrapAt: 80,
  preserveWhitespace: preserveWhitespace,
  removeWhitespace: true,
  ignoreWhitespace: true,
  trimText: true,
  normalizeWhitespace: true
};

var text = function text(node) {
  return escapeHtml(node.nodeValue());
};

var comment = function comment(node) {
  return '<!--' + node.nodeValue() + '-->';
};

var doctype = function doctype(node) {
  var ml = '';

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

  return ml;
};

var openTag = function openTag(node) {
  var ml = '<' + node.tagName();

  var attributes = node.getAttributes();

  Object.keys(attributes).forEach(function (name) {
    var value = attributes[name];

    ml += ' ' + name;

    if (value) ml += '="' + value + '"';
  });

  ml += node.isEmpty() ? ' />' : '>';

  return ml;
};

var closeTag = function closeTag(node) {
  return node.isEmpty() ? '' : '</' + node.tagName() + '>';
};

var wrap = function wrap(str, maxLength, indentation) {
  maxLength = maxLength - indentation.length;

  var segs = str.split(' ');
  var result = [];
  var line = [];
  var length = 0;

  segs.forEach(function (seg) {
    if (length + seg.length >= maxLength) {
      result.push(line.join(' '));
      line = [];
      length = 0;
    }

    length += seg.length + 1;
    line.push(seg);
  });

  result.push(line.join(' '));

  return result.map(function (line) {
    return indentation + line + '\n';
  }).join('');
};

var stringify = function stringify(node) {
  var stringify = function stringify() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    options = Object.assign({}, defaultOptions, options);

    var _options = options,
        indent = _options.indent,
        wrapAt = _options.wrapAt,
        preserveWhitespace = _options.preserveWhitespace;
    var _options2 = options,
        pretty = _options2.pretty,
        depth = _options2.depth;


    pretty = pretty && is.function(node.isInline);

    var hasChildren = node.hasChildren();
    var isElement = node.isElement();
    var indentation = '';
    var eol = '';
    var openTagEol = '';
    var closeTagIndentation = '';
    var isAllInline = false;
    var isWrappableTag = false;

    if (pretty) {
      isAllInline = node.getChildren().every(function (child) {
        return child.isInline() || child.isText();
      });
      var isTagIndented = hasChildren && !isAllInline;

      indentation = indent.repeat(depth);
      eol = '\n';
      openTagEol = isTagIndented ? eol : '';
      closeTagIndentation = isTagIndented ? indentation : '';
      isWrappableTag = isAllInline && !preserveWhitespace.includes(node.tagName());

      node.whitespace(options);
    }

    var ml = '';

    if (node.isText()) {
      ml += indentation + text(node) + eol;

      return ml;
    }

    if (node.isComment()) {
      ml += indentation + comment(node) + eol;

      return ml;
    }

    if (node.isDocumentType()) {
      ml += indentation + doctype(node) + eol;

      return ml;
    }

    var length = 0;
    var close = '';

    if (isElement) {
      var open = indentation + openTag(node) + openTagEol;
      ml += open;
      length += open.length;

      close = closeTagIndentation + closeTag(node) + eol;

      length += close.length;
    }

    if (hasChildren) {
      var children = node.getChildren();

      var childMls = '';
      var childrenLength = 0;

      children.forEach(function (child, i) {
        var options = {};

        if (pretty) {
          var isFirst = i === 0;
          var isLast = i === children.length - 1;
          var childDepth = isElement ? depth + 1 : depth;
          var isPretty = !isAllInline;

          options = { indent: indent, pretty: isPretty, depth: childDepth };
        }

        var childMl = child.stringify(options);

        childrenLength += childMl.length;

        childMls += childMl;
      });

      if (pretty && isWrappableTag && length + childrenLength > wrapAt) {
        ml += eol;

        var childIndentation = indent.repeat(depth + 1);

        childMls = wrap(childMls, wrapAt, childIndentation);

        ml += childMls;

        ml += indentation;
      } else {
        ml += childMls;
      }
    }

    ml += close;

    return ml;
  };

  return { stringify: stringify };
};

module.exports = stringify;