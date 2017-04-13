'use strict';

var is = require('@mojule/is');
var flatten = require('@mojule/flatten');

var expand = flatten.expand;


var valueTypes = ['number', 'boolean', 'null', 'string'];

var convert = {
  number: function number(str) {
    return parseFloat(str);
  },
  boolean: function boolean(str) {
    return str === 'true';
  },
  null: function _null(str) {
    return null;
  }
};

var attributes = function attributes(node) {
  return {
    getAttributes: function getAttributes() {
      var attributes = node.getValue('attributes');

      if (!is.undefined(attributes)) {
        if (is.object(attributes)) return attributes;

        throw new Error('If attributes is present in node value it should be an object');
      }

      return {};
    },
    setAttributes: function setAttributes(attr) {
      if (!is.object(attr)) throw new Error('Attributes must be an object');

      var attributes = node.getAttributes();

      Object.keys(attr).forEach(function (name) {
        var value = attr[name];

        node.setAttr(name, value);
      });

      node.setValue('attributes', attributes);

      return attributes;
    },
    attributes: function attributes(attr) {
      if (!is.undefined(attr)) return node.setAttributes(attr);

      return node.getAttributes();
    },
    getAttr: function getAttr(name) {
      return node.getAttributes()[name];
    },
    setAttr: function setAttr(name, value) {
      var attributes = node.getAttributes();

      attributes[name] = value.toString();

      node.setValue('attributes', attributes);

      return value;
    },
    attr: function attr(name, value) {
      if (!is.undefined(value)) return node.setAttr(name, value);

      return node.getAttr(name);
    },
    hasAttr: function hasAttr(name) {
      return !is.undefined(node.getAttr(name));
    },
    removeAttr: function removeAttr(name) {
      var attributes = node.getAttributes();
      var value = attributes[name];

      delete attributes[name];

      node.setValue('attributes', attributes);

      return value;
    },
    clearAttrs: function clearAttrs() {
      return node.setValue('attributes', {});
    },
    $valueToAttributes: function $valueToAttributes(value) {
      value = flatten(value);

      return Object.keys(value).reduce(function (attrs, key) {
        var newKey = key.replace(/\./g, '_').replace(/\[(\d+)\]/g, '-$1');

        var valueType = is.of(value[key]);

        if (valueType !== 'string') newKey += '-' + valueType;

        attrs[newKey] = value[key] === null ? 'null' : value[key].toString();

        return attrs;
      }, {});
    },
    $attributesToValue: function $attributesToValue(attr) {
      if (!is.object(attr)) throw new Error('Attributes must be an object');

      attr = Object.keys(attr).reduce(function (value, key) {
        var attrValue = attr[key];

        var valueType = valueTypes.find(function (t) {
          return key.endsWith('-' + t);
        });

        if (valueType) {
          var index = key.lastIndexOf('-' + valueType);
          key = key.substr(0, index);
          attrValue = convert[valueType](attrValue);
        }

        var newKey = key.replace(/-(\d+)/g, '[$1]').replace(/_/g, '.');

        value[newKey] = attrValue;

        return value;
      }, {});

      var value = expand(attr);

      return value;
    }
  };
};

module.exports = attributes;