'use strict'

const is = require( '@mojule/is' )

const creators = [
  'createElement', 'createText', 'createComment', 'createDocument',
  'createDocumentType', 'createDocumentFragment'
]

const Adapter = Tree => {
  const adapter = {
    isNode: node => is.function( node.get ),
    appendChild: ( node, child ) => node.append( child ),
    addAttributes: ( node, attributes ) => node.setAttributes( attributes ),
  }

  creators.forEach( key => adapter[ key ] = Tree[ key ] )

  return adapter
}

module.exports = Adapter
