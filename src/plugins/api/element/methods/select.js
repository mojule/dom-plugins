'use strict'

const select = ({ api, state, core }) => {
  const canSelect =
    api.isElementNode() || api.isDocumentNode() || api.isDocumentFragmentNode()

  if( !canSelect ) return

  api.select = selector => {
    const { getApi } = core

    if( api.matches( selector ) )
      return getApi( state )

    return api.querySelector( selector )
  }
}

module.exports = select
