'use strict';

var baseAdapter = require('css-select-base-adapter');

var isTag = function isTag(node) {
  return node.isElement();
};

var getAttributeValue = function getAttributeValue(node, name) {
  return node.getAttr(name);
};

var getChildren = function getChildren(node) {
  return node.getChildren();
};

var getName = function getName(node) {
  return node.tagName();
};

var getParent = function getParent(node) {
  return node.getParent();
};

var getText = function getText(node) {
  return node.getText();
};

var adapter = baseAdapter({
  isTag: isTag, getAttributeValue: getAttributeValue, getChildren: getChildren, getName: getName, getParent: getParent, getText: getText
});

module.exports = adapter;