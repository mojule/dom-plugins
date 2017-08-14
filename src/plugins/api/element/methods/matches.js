'use strict'

const CSSselect = require( 'css-select' )
const is = require( '@mojule/is' )
const adapter = require( '../../../../css-select-adapter' )

const options = { adapter }

const matches = ({ api, state, core }) => {
  api.matches = selector => {
    if( !is.string( api.tagName ) ) return false

    const { getApi } = core
    const current = getApi( state )

    return CSSselect.is( current, selector, options )
  }
}

module.exports = matches
