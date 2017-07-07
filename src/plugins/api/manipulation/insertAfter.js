'use strict'

const insertAfter = ({ api, state, core }) => {
  const { insertAfter } = api

  api.insertAfter = ( child, reference ) => {
    child = insertAfter( child, reference )

    if( child.isDocumentFragmentNode() )
      child.unwrap()

    return child
  }
}

module.exports = insertAfter
