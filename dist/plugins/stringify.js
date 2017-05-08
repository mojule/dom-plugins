'use strict';

var is = require('@mojule/is');
var utils = require('@mojule/utils');
var preserveWhitespace = require('./preserve-whitespace');

var escapeHtml = utils.escapeHtml;


var defaultOptions = {
  indent: '  ',
  eol: '\n',
  pretty: false,
  depth: 0,
  wrapAt: 80,
  preserveWhitespace: preserveWhitespace,
  normalizeWhitespace: true
};

var stringify = function stringify(node) {
  return {
    stringify: function stringify() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      options = Object.assign({}, defaultOptions, options);

      var isPretty = options.pretty && is.function(node.isInline);

      var arr = [];

      if (isPretty) {
        node.whitespace(options);
        addPretty(arr, node, options);
      } else {
        addNode(arr, node);
      }

      return arr.join('');
    }
  };
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

var addNode = function addNode(arr, node) {
  var isElement = node.isElement();

  if (node.isText()) {
    arr.push(text(node));

    return;
  }

  if (node.isComment()) {
    arr.push(comment(node));

    return;
  }

  if (node.isDocumentType()) {
    arr.push(doctype(node));

    return;
  }

  if (isElement) {
    arr.push(openTag(node));
  }

  node.getChildren().forEach(function (child) {
    addNode(arr, child);
  });

  if (isElement && !node.isEmpty()) {
    arr.push(closeTag(node));
  }
};

var addPretty = function addPretty(arr, node, options) {
  var depth = options.depth,
      indent = options.indent,
      eol = options.eol,
      wrapAt = options.wrapAt,
      preserveWhitespace = options.preserveWhitespace;


  var isElement = node.isElement();
  var indentation = indent.repeat(depth);

  if (node.isText()) {
    arr.push(indentation + text(node) + eol);

    return;
  }

  if (node.isComment()) {
    arr.push(indentation + comment(node) + eol);

    return;
  }

  if (node.isDocumentType()) {
    arr.push(indentation + doctype(node) + eol);

    return;
  }

  if (!node.isElement()) {
    node.getChildren().forEach(function (child) {
      addPretty(arr, child, options);
    });

    return;
  }

  if (preserveWhitespace.includes(node.tagName())) {
    arr.push(indentation + openTag(node));

    node.getChildren().forEach(function (child) {
      return addNode(arr, child);
    });

    arr.push(closeTag(node) + eol);

    return;
  }

  var isAllInline = node.getChildren().every(function (child) {
    return child.isInline() || child.isText();
  });

  var childOptions = Object.assign({}, options, { depth: depth + 1 });

  if (!isAllInline) {
    arr.push(indentation + openTag(node) + eol);

    node.getChildren().forEach(function (child) {
      return addPretty(arr, child, childOptions);
    });

    arr.push(indentation + closeTag(node) + eol);

    return;
  }

  var open = openTag(node);
  var close = closeTag(node);

  var children = [];

  node.getChildren().forEach(function (child) {
    addNode(children, child);
  });

  var childLength = children.reduce(function (sum, child) {
    return sum + child.length;
  }, 0);

  var length = indentation.length + open.length + childLength + close.length;

  if (length <= wrapAt) {
    var el = indentation + open + children.join('') + close + eol;

    arr.push(el);

    return;
  }

  arr.push(indentation + open + eol);
  pushWrapped(arr, children, childOptions);
  arr.push(indentation + close + eol);
};

var pushWrapped = function pushWrapped(arr, children, options) {
  var depth = options.depth,
      indent = options.indent,
      eol = options.eol,
      wrapAt = options.wrapAt;

  var indentation = indent.repeat(depth);
  var maxLength = wrapAt - indentation.length;

  var segs = children.map(function (child, i) {
    if (child.startsWith('<')) {
      return child.replace(/ /g, '\\U0020');
    }

    if (i === 0) return child.replace(/^\s/g, '');

    return child;
  }).join('').split(' ');

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

  arr.push(result.map(function (line) {
    return indentation + line + eol;
  }).join('').replace(/\\U0020/g, ' '));
};

module.exports = stringify;