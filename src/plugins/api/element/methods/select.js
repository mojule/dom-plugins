'use strict'

const select = ({ api, state, core }) => {
  const canSelect =
    api.isElementNode() || api.isDocumentNode() || api.isDocumentFragmentNode()

  if( !canSelect ) return

  api.select = selector => {
    if( api.isElementNode() && api.matches( selector ) )
      return api

    return api.querySelector( selector )
  }
}

module.exports = select
