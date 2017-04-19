'use strict'

const is = require( '@mojule/is' )

const name = node => {
  return {
    tagName: value => {
      if( is.string( value ) ){
        return node.setTagName( value )
      }

      return node.getTagName()
    },
    getTagName: () => {
      const tagName = node.getValue( 'tagName' )

      if( is.string( tagName ) ){
        if( tagName.trim() === '' )
          throw new Error( 'Expected tagName to be a non-empty string' )

        return tagName
      }

      return node.nodeType()
    },
    setTagName: value => {
      if( !is.string( value ) || value.trim() === '' )
        throw new Error( 'Expected tagName to be a non-empty string' )

      value = value.trim()

      node.setValue( 'tagName', value )

      return value
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
