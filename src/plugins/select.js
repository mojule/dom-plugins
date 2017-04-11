'use strict'

const CSSselect = require( 'css-select' )
const adapter = require( '../css-select-adapter' )

const options = { adapter }

const selectPlugin = node => {
  return {
    querySelector: selector => CSSselect.selectOne( selector, node, options ),
    querySelectorAll: selector => CSSselect( selector, node, options ),
    matches: selector => CSSselect.is( node, selector, options )
  }
}

module.exports = selectPlugin
