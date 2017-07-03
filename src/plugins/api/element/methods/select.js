'use strict'

const select = ({ api, state, core }) => {
  if( !api.isElementNode() ) return

  api.select = selector => {
    const { getApi } = core

    if( api.matches( selector ) )
      return getApi( state )

    return api.querySelector( selector )
  }
}

module.exports = select
