'use strict'

const isEmpty = node => {
  const { isEmpty } = node

  return {
    isEmpty: () => {
      if( node.isText() || node.isComment() || node.isDocumentType() )
        return true

      if( node.isDocumentFragment() || node.isDocument() )
        return false

      return isEmpty()
    }
  }
}

module.exports = isEmpty
