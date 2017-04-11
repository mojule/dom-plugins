'use strict'

const is = require( '@mojule/is' )

const text = node => {
  if( is.array( node ) )
    return node.map( text ).join( '' )

  if( node.isText() )
    return node.nodeValue()

  const children = node.getChildren()

  if( children.length > 0 )
    return text( children )

  return ''
}

const getText = node => {
  return {
    getText: () => text( node )
  }
}

module.exports = getText
