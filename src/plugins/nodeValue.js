'use strict'

const is = require( '@mojule/is' )

const nodeValue = node => {
  return {
    getNodeValue: () => node.getValue( 'nodeValue' ),
    setNodeValue: value => {
      if( is.undefined( value ) )
        throw new Error( 'nodeValue cannot be undefined' )

      return node.setValue( 'nodeValue', value )
    },
    nodeValue: value => {
      if( !is.undefined( value ) )
        return node.setNodeValue( value )

      return node.getNodeValue()
    }
  }
}

module.exports = nodeValue
