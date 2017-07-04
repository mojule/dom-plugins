'use strict'

const is = require( '@mojule/is' )

const isEqualNode = ({ api, state, core }) => {
  api.isEqualNode = node => {
    const current = core.getApi( state )

    if( node === current ) return true
    if( node.nodeType !== current.nodeType ) return false
    if( is.string( node.nodeValue ) ) return current.nodeValue === node.nodeValue
    if( node.tagName !== current.tagName ) return false

    // close enough?
    return node.outerHTML === current.outerHTML
  }
}

module.exports = isEqualNode
