'use strict'

const prependChild = ({ api, state, core }) => {
  const { prependChild } = api

  api.prependChild = child => {
    child = prependChild( child )

    if( child.parentNode && child.isDocumentFragmentNode() )
      child.unwrap()

    return child
  }
}

module.exports = prependChild
