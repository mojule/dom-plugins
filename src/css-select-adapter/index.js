'use strict'

const baseAdapter = require( 'css-select-base-adapter' )
const is = require( '@mojule/is' )

const isTag = node => is.string( node.tagName )

const getAttributeValue = ( node, name ) =>
  node.getAttribute( name ) || undefined

const getChildren = node => Array.from( node.childNodes )

const getName = node => node.tagName

const getParent = node => node.parentNode

const getText = node => node.innerText

const adapter = baseAdapter({
  isTag, getAttributeValue, getChildren, getName, getParent, getText
})

module.exports = adapter
