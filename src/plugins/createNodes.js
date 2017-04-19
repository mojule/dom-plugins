'use strict'

const { escapeHtml } = require( '@mojule/utils' )

const createOmNode = node => {
  return {
    $createText: text => {
      const value = {
        nodeType: 'text',
        nodeValue: escapeHtml( text )
      }

      return node( value )
    },
    $createComment: comment => {
      const value = {
        nodeType: 'comment',
        nodeValue: escapeHtml( comment )
      }

      return node( value )
    },
    $createDocumentFragment: () => {
      const value = { nodeType: 'documentFragment' }

      return node( value )
    },
    $createDocumentType: ( name, publicId = '', systemId = '' ) => {
      const nodeType = 'documentType'
      const value = { nodeType, name, publicId, systemId }

      return node( value )
    },
    $createDocument: () => {
      const value = { nodeType: 'document' }

      return node( value )
    },
    $createElement: ( tagName, attributes = {} ) => {
      const nodeType = 'element'
      const value = { nodeType, tagName, attributes }

      return node( value )
    }
  }
}

module.exports = createOmNode
