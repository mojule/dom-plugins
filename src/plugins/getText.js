'use strict'

const is = require( '@mojule/is' )

const getText = node => {
  return {
    getText: () => {
      if( node.isText() )
        return node.nodeValue()

      const children = node.getChildren()

      if( children.length > 0 )
        return children.reduce( ( text, child ) => text + child.getText(), '' )

      return ''
    }
  }
}

module.exports = getText
