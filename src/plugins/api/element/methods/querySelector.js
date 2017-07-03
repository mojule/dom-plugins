'use strict'

const CSSselect = require( 'css-select' )
const adapter = require( '../../../../css-select-adapter' )

const options = { adapter }

const querySelector = ({ api, state, core }) => {
  if( !api.isElementNode() ) return

  api.querySelector = selector => {
    const { getApi } = core
    const current = getApi( state )

    return CSSselect.selectOne( selector, current, options )
  }
}

module.exports = querySelector
