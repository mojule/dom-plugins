'use strict'

const attributes = require( './plugins/attributes' )
const classes = require( './plugins/classes' )
const createNodes = require( './plugins/createNodes' )
const dataset = require( './plugins/dataset' )
const getText = require( './plugins/getText' )
const hFactory = require( './plugins/h-factory' )
const isEmpty = require( './plugins/isEmpty' )
const isType = require( './plugins/isType' )
const name = require( './plugins/name' )
const nodeValue = require( './plugins/nodeValue' )
const parser = require( './plugins/parser' )
const select = require( './plugins/select' )
const stringify = require( './plugins/stringify' )
const treeType = require( './plugins/treeType' )

module.exports = [
  isType, attributes, classes, createNodes, dataset, getText, hFactory, isEmpty, 
  isType, name, nodeValue, parser, select, stringify, treeType
]
