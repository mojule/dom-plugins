'use strict';

var is = require('@mojule/is');

var ensureName = function ensureName(name) {
  if (!is.string(name) || name.trim() === '') throw new Error('Class name should be a non-empty string');
};

var classes = function classes(node) {
  return {
    classNames: function classNames() {
      var classAttr = node.getAttr('class');

      if (is.string(classAttr)) return classAttr.split(' ').map(function (s) {
        return s.trim();
      }).filter(function (s) {
        return s !== '';
      });

      return [];
    },
    addClass: function addClass(name) {
      ensureName(name);

      var classNames = node.classNames();

      classNames.push(name.trim());

      node.setAttr('class', classNames.join(' '));

      return node;
    },
    hasClass: function hasClass(name) {
      return node.classNames().includes(name);
    },
    addClasses: function addClasses() {
      for (var _len = arguments.length, names = Array(_len), _key = 0; _key < _len; _key++) {
        names[_key] = arguments[_key];
      }

      if (names.length === 1 && is.array(names[0])) names = names[0];

      names.forEach(node.addClass);

      return node;
    },
    removeClass: function removeClass(name) {
      ensureName(name);

      var classNames = node.classNames().filter(function (n) {
        return n !== name.trim();
      });

      node.setAttr('class', classNames.join(' '));

      return node;
    },
    toggleClass: function toggleClass(name, shouldHave) {
      ensureName(name);

      name = name.trim();

      var alreadyHas = node.hasClass(name);

      if (is.undefined(shouldHave)) return node.toggleClass(name, !alreadyHas);

      if (alreadyHas) {
        if (shouldHave) return node;

        return node.removeClass(name);
      }

      if (shouldHave) return node.addClass(name);

      return node;
    },
    clearClasses: function clearClasses() {
      node.setAttr('class', '');

      return node;
    }
  };
};

module.exports = classes;