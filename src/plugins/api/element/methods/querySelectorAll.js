'use strict'

const CSSselect = require( 'css-select' )
const adapter = require( '../../../../css-select-adapter' )

const options = { adapter }

const querySelectorAll = ({ api, state, core }) => {
  if( !api.isElementNode() ) return

  api.querySelectorAll = selector => {
    const { getApi, nodeList } = core
    const current = getApi( state )

    return nodeList( CSSselect( selector, current, options ) )
  }
}

module.exports = querySelectorAll
