'use strict'

const CSSselect = require( 'css-select' )
const adapter = require( '../../../../css-select-adapter' )

const options = { adapter }

const matches = ({ api, state, core }) => {
  if( !api.isElementNode() ) return

  api.matches = selector => {
    if( api.isDocumentFragmentNode() ) return false

    const { getApi } = core
    const current = getApi( state )

    return CSSselect.is( current, selector, options )
  }
}

module.exports = matches
