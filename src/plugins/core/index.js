'use strict'

const defaultAttributes = require( './attributes/defaultAttributes' )
const registerAttributes = require( './attributes/registerAttribute' )
const registerElement = require( './elements/registerElement' )
const nodeType = require( './nodeType' )
const state = require( './state' )

module.exports = [
  registerAttributes, defaultAttributes, registerElement, nodeType, state
]
