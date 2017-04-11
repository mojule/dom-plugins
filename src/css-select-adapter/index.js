'use strict'

const baseAdapter = require( 'css-select-base-adapter' )

const isTag = node => node.isElement()

const getAttributeValue = ( node, name ) => node.getAttr( name )

const getChildren = node => node.getChildren()

const getName = node => node.tagName()

const getParent = node => node.getParent()

const getText = node => node.getText()

const adapter = baseAdapter({
  isTag, getAttributeValue, getChildren, getName, getParent, getText
})

module.exports = adapter
