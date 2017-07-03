'use strict'

const closest = ({ api }) => {
  if( !api.isElementNode() ) return

  api.closest = selector => {
    const target = api.inclusiveAncestorNodes.find( current =>
      current.matches( selector )
    )

    return target || null
  }
}

module.exports = closest
