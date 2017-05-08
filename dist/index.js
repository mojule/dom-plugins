'use strict';

var attributes = require('./plugins/attributes');
var classes = require('./plugins/classes');
var createNodes = require('./plugins/createNodes');
var dataset = require('./plugins/dataset');
var getText = require('./plugins/getText');
var hFactory = require('./plugins/h-factory');
var isEmpty = require('./plugins/isEmpty');
var isType = require('./plugins/isType');
var name = require('./plugins/name');
var nodeValue = require('./plugins/nodeValue');
var parser = require('./plugins/parser');
var select = require('./plugins/select');
var stringify = require('./plugins/stringify');
var treeType = require('./plugins/treeType');
var whitespace = require('./plugins/whitespace');

module.exports = [isType, attributes, classes, createNodes, dataset, getText, hFactory, isEmpty, isType, name, nodeValue, parser, select, stringify, treeType, whitespace];