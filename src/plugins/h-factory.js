'use strict'

const is = require( '@mojule/is' )
const H = require( 'html-script' )
const Adapter = require( '../html-script-adapter' )

const nonTags = [ 
  '#text', '#comment', '#document', '#document-type', '#document-fragment'
]

const HFactory = api => {  
  return {
    $H: ( ...nodeNames ) => {
      if( nodeNames.length === 1 && is.array( nodeNames[ 0 ] ) )
        nodeNames = nodeNames[ 0 ]

      const options = {}

      if( nodeNames.length > 0 )
        options.nodeNames = nodeNames.concat( nonTags )

      const adapter = Adapter( api )
      const h = H( adapter, options )

      return h
    }
  }
}

module.exports = HFactory
