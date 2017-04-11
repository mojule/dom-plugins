'use strict'

const isType = node => {
  return {
    isText: () => node.nodeType() === 'text',
    isComment: () => node.nodeType() === 'comment',
    isDocumentFragment: () => node.nodeType() === 'documentFragment',
    isDocumentType: () => node.nodeType() === 'documentType',
    isDocument: () => node.nodeType() === 'document',
    isElement: () => {
      if( node.nodeType() === 'element' )
        return true

      return (
        !node.isText() && !node.isComment() && !node.isDocumentFragment() &&
        !node.isDocumentType() && !node.isDocument()
      )
    }
  }
}

module.exports = isType
