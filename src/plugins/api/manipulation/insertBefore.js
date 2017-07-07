'use strict'

const insertBefore = ({ api, state, core }) => {
  const { insertBefore } = api

  api.insertBefore = ( child, reference ) => {
    child = insertBefore( child, reference )

    if( child.isDocumentFragmentNode() )
      child.unwrap()

    return child
  }
}

module.exports = insertBefore
