'use strict'

const CSSselect = require( 'css-select' )
const adapter = require( '../../../../css-select-adapter' )

const options = { adapter }

const querySelectorAll = ({ api, state, core }) => {
  const canSelect =
    api.isElementNode() || api.isDocumentNode() || api.isDocumentFragmentNode()

  if( !canSelect ) return

  api.querySelectorAll = selector => {
    const { getApi, nodeList } = core
    const current = getApi( state )

    return nodeList( CSSselect( selector, current, options ) )
  }
}

module.exports = querySelectorAll
