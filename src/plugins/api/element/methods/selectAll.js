'use strict'

const selectAll = ({ api, state, core }) => {
  const canSelect =
    api.isElementNode() || api.isDocumentNode() || api.isDocumentFragmentNode()

  if( !canSelect ) return

  api.selectAll = selector => {
    const { getApi, nodeList } = core

    let result = nodeList([])

    if( api.matches( selector ) )
      result = result.append( getApi( state ) )

    return result.concat( api.querySelectorAll( selector ) )
  }
}

module.exports = selectAll
