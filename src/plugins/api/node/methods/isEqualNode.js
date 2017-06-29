'use strict'

const isEqualNode = ({ api, state, core }) => {
  api.isEqualNode = node => {
    const current = core.getApi( state )

    if( node === current ) return true
    if( node.nodeType !== current.nodeType ) return false
    if( node.tagName !== current.tagName ) return false

    // lol
    return node.outerHTML === current.outerHTML
  }
}

module.exports = isEqualNode
