'use strict'

const is = require( '@mojule/is' )

const name = node => {
  return {
    tagName: () => {
      const tagName = node.getValue( 'tagName' )

      if( is.string( tagName ) ){
        if( tagName.length === 0 )
          throw new Error( 'Expected tagName to be a non-empty string' )

        return tagName
      }

      return node.nodeType()
    },
    nodeName: () => {
      if( node.isText() )
        return '#text'

      if( node.isComment() )
        return '#comment'

      if( node.isDocument() )
        return '#document'

      if( node.isDocumentFragment() )
        return '#document-fragment'

      if( node.isDocumentType() ){
        const name = node.getValue( 'name' )

        if( is.string( name ) ){
          if( name.length === 0 )
            throw new Error(
              'Expected document type name to be a non-empty string'
            )

          return name
        }

        return node.treeType()
      }

      return node.tagName()
    }
  }
}

module.exports = name
