'use strict'

const selectAll = ({ api, state, core }) => {
  if( !api.isElementNode() ) return

  api.selectAll = selector => {
    const { getApi, nodeList } = core

    let result = nodeList([])

    if( api.matches( selector ) )
      result = result.append( getApi( state ) )

    return result.concat( api.querySelectorAll( selector ) )
  }
}

module.exports = selectAll
