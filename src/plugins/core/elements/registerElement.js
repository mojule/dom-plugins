'use strict'

const is = require( '@mojule/is' )

const element = ({ core }) => {
  const elements = new Map()

  core.registerElement = ({
    tagName,
    isEmpty = node => false,
    accepts = ( parent, child ) => !core.isEmptyElement( parent )
  }) => {
    if( !is.string( tagName ) )
      throw Error( 'Expected name to be a string' )

    if( elements.has( tagName ) )
      throw Error(
        `element ${ tagName } is already registered`
      )

    elements.set( tagName, { tagName, isEmpty, accepts } )
  }

  const { isEmpty, accepts } = core

  core.isEmpty = node => {
    if( node.isElementNode() && elements.has( node.tagName ) )
      return elements.get( node.tagName ).isEmpty

    return isEmpty( node )
  }

  core.accepts = ( parent, child ) => {
    if( parent.isElementNode() && elements.has( parent.tagName ) )
      return elements.get( parent.tagName ).accepts( parent, child )

    return accepts( parent, child )
  }

  core.registerProperty({
    target: core,
    name: 'tagNames',
    get: () => Array.from( elements.keys() )
  })
}

module.exports = element
