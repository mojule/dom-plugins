'use strict'

const baseAdapter = require( 'css-select-base-adapter' )
const is = require( '@mojule/is' )

const isTag = node => node.isElementNode()

const getAttributeValue = ( node, name ) => {
  if( is.function( node.getAttribute ) ){
    const value = node.getAttribute( name )

    if( !is.null( value ) ) return value
  }
}

const getChildren = node => node.childNodes

const getName = node => node.tagName

const getParent = node => node.parentNode

const getText = node => node.innerText

const adapter = baseAdapter({
  isTag, getAttributeValue, getChildren, getName, getParent, getText
})

module.exports = adapter
